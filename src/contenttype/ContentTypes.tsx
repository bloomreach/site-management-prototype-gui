import React from 'react';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import {
    Accordion,
    AccordionSummary,
    AppBar,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    List,
    ListItem,
    SvgIcon,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import {getBaseUrl, getContentTypeOperationsApi, getGenericContentTypesApi} from "../ApiContext";
import {LogContext} from "../LogContext";
import {logError, logSuccess} from "../common/common-utils";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {ContentType} from "../api/models/contenttype";
import {ContentTypeOperationsApi} from "../api/apis/content-type-operations-api";
import Drawer from '@material-ui/core/Drawer';
import {createInterfacesFromContentTypes} from "./content-type-utils";
import {InstallationAction} from "../plugins/Plugins";

var nomnoml = require('nomnoml');

const dependencyTypes: Array<string> = ['FieldGroup', 'SelectableFieldGroup'];


type ContentTypesState = {
    types: Array<ContentType>,
    selectedTypesForExport: Array<ContentType>,
    noDevelopmentProject: boolean
    diagramDialogOpen: boolean
    exportTypesDialogOpen: boolean
    intfcsDialogOpen: boolean
    diagram: string
    intfcs: string
}
type ContentTypesProps = {
    classes: any,
}

// @ts-ignore
const styles = theme => {
    return ({
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    });
};

const hasDependencies = function (ctype: ContentType) {
    let hasDependency = false;
    if (ctype.fields) {
        for (const field of ctype.fields) {
            hasDependency = dependencyTypes.includes(field.type);
            if (hasDependency)
                break;
        }
    }
    return hasDependency;
}

class ContentTypes extends React.Component<ContentTypesProps, ContentTypesState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: ContentTypesProps) {
        super(props);

        this.state = {
            diagram: '',
            intfcs: '',
            types: [],
            noDevelopmentProject: true,
            diagramDialogOpen: false,
            exportTypesDialogOpen: false,
            intfcsDialogOpen: false,
            selectedTypesForExport: []
        }
    }

    componentDidMount(): void {
        this.updateContentTypes();
    }

    updateContentTypes() {
        const api: ContentTypeOperationsApi = getContentTypeOperationsApi();
        api.getContentTypes('development').then(value => {
            const types: Array<ContentType> = value.data;
            // console.log(createInterfacesFromContentTypes( types));
            this.setState({
                types: types,
                noDevelopmentProject: false,
                diagram: this.generateDiagram(types),
                intfcs: createInterfacesFromContentTypes(types)
            });
            logSuccess('retrieved content types..', this.context);
        }).catch(reason => {
            logError("error trying to get the content types from development, reason:", reason?.data)
            api.getContentTypes('core').then(value => {
                const types: Array<ContentType> = value.data;
                // console.log(createInterfacesFromContentTypes( types));
                this.setState({
                    types: types,
                    noDevelopmentProject: true,
                    diagram: this.generateDiagram(types),
                    intfcs: createInterfacesFromContentTypes(types)
                });
                logSuccess('fallback.. retrieved content types from core', this.context);
            });
        });
    }

    generateDiagram(types: Array<ContentType>): string {
        const heading = '#.document: title=bold fill=lightgrey \n' +
            '#.fieldgroup: title=bold';
        const umlDiagram = types.map(type => {
            const fields = type?.fields?.map(field => {
                return `${field.name}${field.required ? '*' : ''}: ${field.type === 'FieldGroup' ? field.fieldGroupType : field.type}${field.multiple ? '\\[\\]' : ''}`
            }).join(';');
            return `[${type.type === 'Document' ? '<document>' : '<fieldgroup>'}${type.name}|${fields}]`
        }).join('\n');
        const relations = types.map(type => {
            const fields = type?.fields?.map(field => {
                const relation = (field.type === 'FieldGroup' && types.some((element) => element.name === field.fieldGroupType)) ? field.fieldGroupType : undefined;
                return relation ? `[${type.name}]-> [${relation}]\n` : '';
            }).join('');
            return `${fields}`
        }).join('');
        const diagram = heading.concat('\n').concat(umlDiagram).concat('\n').concat(relations).trim();
        // console.log(diagram);
        return diagram;
    }

    importFromClipBoard() {
        navigator.clipboard.readText().then(value => {
            const installationActions: Array<InstallationAction> = JSON.parse(value);
            const isArray = Array.isArray(installationActions);
            if (isArray) {
                (async function () {
                    const genericContentTypesApi = getGenericContentTypesApi();
                    let success = true;
                    let errors = []
                    for (const installationAction of installationActions) {
                        try {
                            const result = await genericContentTypesApi.put(installationAction.path, undefined, installationAction.body)
                            if (result.status !== installationAction.responseCode) {
                                success = false;
                                errors.push(`${result.data?.reason} ${installationAction.path}`)
                            }
                        } catch (error) {
                            success = false;
                            errors.push(`${error.toString()} ${installationAction.path}`)
                        }
                    }
                    if (!success) {
                        throw new Error(errors.join("\n"));
                    }
                })().then(() => {
                    this.updateContentTypes();
                }).catch(reason => {
                    logError(reason.toString(), this.context);
                })
            }
        });
    }

    createPluginJs() {
        const installationActions: Array<InstallationAction> = this.state.selectedTypesForExport.map(type => {
            const body = {...type}
            //@ts-ignore
            delete body.enabled;
            delete body.system
            return {
                type: 'contenttypes',
                path: `/development/${type.name}`,
                method: 'PUT',
                body: body,
                responseCode: 201,
                description: `create content type: ${type.name}`
            } as InstallationAction
        })
        return installationActions;
    }


    render() {
        const {classes} = this.props;
        const {
            types,
            noDevelopmentProject,
            diagramDialogOpen,
            exportTypesDialogOpen,
            intfcsDialogOpen,
            diagram,
            intfcs
        } = this.state;
        const blob = new Blob([intfcs], {type: 'text/x.typescript'});
        const fileDownloadUrl = URL.createObjectURL(blob);

        return <>
            <AppBar position="sticky" variant={'outlined'} color={'default'}>
                <Toolbar>
                    <Button
                        variant="outlined"
                        disabled={noDevelopmentProject}
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<AddOutlinedIcon/>}
                        onClick={() => window.open(`${getBaseUrl()}/cms/content/path/hippo:namespaces/brxsaas`, 'new')}
                    >
                        Add Content Type
                    </Button>
                    <Button
                        disabled={!noDevelopmentProject}
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<Icon className="fas fa-code-branch"/>}
                        onClick={() => window.open(`${getBaseUrl()}/cms/projects`, 'new')}
                    >
                        Create Development Project
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        onClick={() => this.setState({intfcsDialogOpen: true})}
                        startIcon={<SvgIcon>
                            <path
                                d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z"></path>
                        </SvgIcon>}
                    >
                        Generate Types
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<Icon className="fas fa-project-diagram"/>}
                        onClick={() => this.setState({diagramDialogOpen: true})}
                    >
                        Generate Diagram
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<FileCopyOutlinedIcon/>}
                        onClick={() => {
                            this.setState({exportTypesDialogOpen: true})
                        }}
                    >
                        Export
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<Icon className="fas fa-paste"/>}
                        onClick={() => this.importFromClipBoard()}
                    >
                        Import
                    </Button>
                </Toolbar>
            </AppBar>
            {types.map((type, index) => {
                return (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}>
                            <Typography className={classes.heading}>{type.name}</Typography>
                            <Typography className={classes.secondaryHeading}>{type.type}</Typography>
                        </AccordionSummary>
                        <Container>
                            <pre>{JSON.stringify(type, undefined, 2)}</pre>
                        </Container>
                    </Accordion>
                )
            })}
            <Drawer anchor={'right'} open={diagramDialogOpen} onClose={() => this.setState({diagramDialogOpen: false})}>
                <Container>
                    {diagram && <div dangerouslySetInnerHTML={{__html: nomnoml.renderSvg(this.state.diagram)}}/>}
                    {/*{intfcs && <div dangerouslySetInnerHTML={{__html: `<pre>${JSON.stringify(JSON.parse(intfcs), undefined, 2)}</pre>`}}/>}*/}
                </Container>
            </Drawer>
            <Drawer anchor={'right'} open={exportTypesDialogOpen}
                    onClose={() => this.setState({exportTypesDialogOpen: false, selectedTypesForExport: []})}>
                <AppBar position="sticky" color={"default"}>
                    <Toolbar>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{marginRight: '10px'}}
                            startIcon={<FileCopyOutlinedIcon/>}
                            onClick={() => {
                                const installationActions = this.createPluginJs();
                                navigator.clipboard.writeText(JSON.stringify(installationActions))
                                const event = new CustomEvent('record', {detail: installationActions});
                                document.dispatchEvent(event);
                            }}
                        >
                            Export to plugin format
                        </Button>
                    </Toolbar>
                </AppBar>
                <Container>

                    <FormGroup row>
                        <List>
                            {types.map(ctype => {
                                return (
                                    <ListItem key={ctype.name} dense button>
                                        <FormControlLabel
                                            control={<Checkbox
                                                onChange={(event, checked) => {
                                                    this.setState(state => {
                                                        const selectedTypesForExport = checked ?
                                                            state.selectedTypesForExport.concat(ctype) :
                                                            state.selectedTypesForExport.filter((item) => ctype.name !== item.name);
                                                        return {
                                                            selectedTypesForExport
                                                        };
                                                    }, () => console.log(this.state.selectedTypesForExport));
                                                }} name={ctype.name}/>}
                                            label={ctype.name + (hasDependencies(ctype) ? '*' : '')}
                                        />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </FormGroup>

                </Container>
            </Drawer>
            <Drawer anchor={'right'} open={intfcsDialogOpen} onClose={() => this.setState({intfcsDialogOpen: false})}>
                <AppBar position="sticky" color={"default"}>
                    <Toolbar>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{marginRight: '10px'}}
                            startIcon={<FileCopyOutlinedIcon/>}
                            onClick={() => navigator.clipboard.writeText(intfcs)}
                        >
                            Copy to clipboard
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{marginRight: '10px'}}
                            startIcon={<GetAppOutlinedIcon/>}
                        >
                            <a style={{textDecoration: 'none', color: 'inherit'}} href={fileDownloadUrl}
                               download={'ctypes.ts'}> Download as file</a>
                        </Button>
                    </Toolbar>
                </AppBar>
                <Container>
                    {intfcs && <div dangerouslySetInnerHTML={{__html: `<pre>${intfcs}</pre>`}}/>}
                </Container>
            </Drawer>
        </>
    }

}

export default withStyles(styles)(ContentTypes);
