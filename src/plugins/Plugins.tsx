import React, {PropsWithChildren} from 'react';
import 'react-sortable-tree/style.css';
import {Nullable} from "../api/models/site/nullable";
import {LogContext} from "../LogContext";
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import {Editor} from 'react-draft-wysiwyg';
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    AppBar,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import ChannelSwitcher from "../common/ChannelSwitcher";
import {getGenericContentTypesApi, getGenericSiteApi, getPlugins} from "../ApiContext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {Grid, List, ListItem} from "@mui/material";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import {Widget, WidgetProps} from "@rjsf/core";
import {convertToRaw, EditorState} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import {GenericPluginApi} from "../api/apis/generic-plugin-api";


const pluginSchema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "icon": {
            "type": "string"
        },
        "description": {
            "type": "string"
        }
    },
    "required": [
        "id",
        "name",
        "icon"
    ]
} as JSONSchema7

const uiSchema = {
    description: {
        "ui:widget": "textarea",
    }
};

const RichTextWidget: Widget = function (props: PropsWithChildren<WidgetProps>) {
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty())
    return (<div>
        <h5>{props.label}:</h5>
        <div style={{border: '1px solid lightgrey'}}>
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={
                    (editorState: EditorState) => {
                        setEditorState(editorState)
                        props.onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    }
                }
            /></div>
    </div>)

}


const widgets: { [name: string]: Widget } = {
    "TextareaWidget": RichTextWidget
}

export interface Plugin {
    id: string;
    name: string;
    icon: string;
    description?: string;
    isInstalled: boolean | false
    installationVerification?: InstallationAction;
    installationActionSet?: InstallationAction[];
}

export interface InstallationAction {
    description: string;
    type: string;
    path: string;
    method: string;
    body?: any;
    responseCode: number;
}

type PluginState = {
    currentChannelId: Nullable<string>
    plugins: Array<Plugin>
    recording: boolean
    dialogOpen: boolean
}
type PluginProps = {
    classes: any
}

// @ts-ignore
const styles = theme => {
    return ({
        heading: {
            paddingLeft: '10px',
            paddingTop: '7px',
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '50%',
            flexShrink: 0,
        },
        secondaryHeading: {
            paddingTop: '7px',
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    });
};

const installationActions: Array<InstallationAction> = []

const record = function (e: any) {
    e.detail.forEach((action: InstallationAction) => {
        installationActions.findIndex((item: InstallationAction) => item.path === action.path) === -1 && installationActions.push(action)
    })
};

class Plugins extends React.Component<PluginProps, PluginState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: PluginProps) {
        super(props);

        this.state = {
            currentChannelId: null,
            plugins: [],
            recording: (localStorage.getItem('recording') === 'true'),
            dialogOpen: false
        }

    }

    componentDidMount(): void {
        const pluginApi = getPlugins();
        pluginApi.get('/plugins.json').then(value => {

            const plugins = value.data;
            let customPlugins: Array<string> = JSON.parse(localStorage.getItem("plugins") as string);
            if (Array.isArray<string>(customPlugins)) {
                customPlugins.forEach(customPluginId => {
                    const customPlugin: Plugin = JSON.parse(localStorage.getItem(customPluginId) as string);
                    plugins.push(customPlugin);
                })
            }
            this.setState({plugins: plugins});
        });
        document.addEventListener('record', record)
    }


    installPlugin(plugin: Plugin) {
        if (this.state?.currentChannelId) {
            const channelId = this.state.currentChannelId;
            const that = this;
            (async function () {
                const genericSiteApi: GenericPluginApi = getGenericSiteApi();
                const genericContentTypesApi: GenericPluginApi = getGenericContentTypesApi();
                let success = true;
                let counter = 0;
                if (plugin.installationActionSet) {
                    for (const installationAction of plugin.installationActionSet) {
                        let genericPluginAPI: GenericPluginApi = installationAction.type === 'site' ? genericSiteApi : genericContentTypesApi
                        try {
                            const result = await genericPluginAPI.put(installationAction.path, channelId, installationAction.body)
                            if (result.status === installationAction.responseCode) {
                                counter++;
                            } else {
                                success = false;
                            }
                        } catch (error) {
                            success = false;
                        }
                    }
                    console.log('installation state', success);
                    console.log('installation state installed actions', counter);
                    that.onChannelChanged(channelId);
                }
            })().then(value => {
                console.log('.. plugin installed');
            });
        }
    }

    handlePluginState(response: any, plugin: Plugin, channelId: string) {
        const verification = plugin.installationVerification;
        if (verification && response.status === verification.responseCode) {
            let plugins = this.state.plugins.map(el => (
                el.id === plugin.id ? {...el, isInstalled: true} : el
            ))
            this.setState({plugins: plugins, currentChannelId: channelId})
        } else {
            let plugins = this.state.plugins.map(el => (
                el.id === plugin.id ? {...el, isInstalled: false} : el
            ))
            this.setState({plugins: plugins, currentChannelId: channelId})
        }
    }

    private onChannelChanged(channelId: string) {
        const genericSiteApi = getGenericSiteApi();
        if (this.state.plugins) {
            for (const plugin of this.state.plugins) {
                const verification = plugin.installationVerification;
                if (verification) {
                    genericSiteApi.get(verification.path, channelId).then(response => {
                        this.handlePluginState(response, plugin, channelId);
                    }).catch(error => {
                        error.response && this.handlePluginState(error.response, plugin, channelId);
                    })
                }

            }
        }
    }

    render() {
        const {classes} = this.props;
        const {recording} = this.state;
        let addPlugin: any = {};
        return <>
            <Dialog maxWidth={"md"} open={this.state.dialogOpen} aria-labelledby="form-dialog-title">
                <DialogTitle>Create new plugin</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <Form liveValidate onChange={({formData}) => {
                                    addPlugin = formData
                                    console.log(formData)
                                }} formData={addPlugin}
                                      schema={pluginSchema} uiSchema={uiSchema} widgets={widgets}>
                                    <></>
                                </Form>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={'h5'}>Installation Instructions:</Typography>
                            <List>
                                {installationActions?.map(value => {
                                    return (
                                        <ListItem>
                                            {value.description}
                                        </ListItem>)
                                })}
                            </List>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => {
                        this.setState({recording: false, dialogOpen: false}, () => {
                            addPlugin['installationActionSet'] = installationActions;
                            localStorage.setItem('recording', 'false')
                            let plugins: Array<String> = JSON.parse(localStorage.getItem("plugins") as string);
                            if (Array.isArray<string>(plugins)) {
                                plugins.push(addPlugin.name);
                            } else {
                                plugins = [addPlugin.name]
                            }
                            localStorage.setItem('plugins', JSON.stringify(plugins))
                            localStorage.setItem(addPlugin.name, JSON.stringify(addPlugin))
                        });
                    }}>Add</Button>
                    <Button color="primary" onClick={() => {
                        this.setState({recording: true, dialogOpen: false});
                    }}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <AppBar position="sticky" variant={'outlined'} color={'default'}>
                <Toolbar>
                    <ChannelSwitcher onChannelChanged={channelId => this.onChannelChanged(channelId)}/>
                    {recording ? <Button
                            variant="outlined"
                            color="primary"
                            style={{marginRight: '10px'}}
                            startIcon={<StopOutlinedIcon/>}
                            onClick={() => {
                                // this.setState({recording: false}, () => {
                                //     localStorage.setItem('recording', 'false')
                                // });
                                this.setState({dialogOpen: true})
                            }}
                        >
                            stop recording
                        </Button> :
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{marginRight: '10px'}}
                            startIcon={<FiberManualRecordOutlinedIcon/>}
                            onClick={() => {
                                this.setState({recording: true}, () => {
                                    localStorage.setItem('recording', 'true')
                                });
                            }}
                        >
                            record a plugin
                        </Button>}
                </Toolbar>
            </AppBar>
            {this.state.plugins.map((plugin: Plugin, index) => {
                return (
                    <Accordion key={this.state.currentChannelId + plugin.id}
                               onChange={(event, expanded) => console.log('on change of accordion', expanded)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Avatar variant={"square"} alt={plugin.name} src={plugin.icon}>{plugin.name}</Avatar>
                            <Typography className={classes.heading}>{plugin.name}</Typography>
                            <Typography
                                className={classes.secondaryHeading}>{plugin.isInstalled ? 'installed' : 'ready to install'}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {plugin.description && <Grid item xs={12}>
                                    <Typography variant={'h5'}>Description:</Typography>
                                    <div dangerouslySetInnerHTML={{__html: plugin.description}}/>
                                </Grid>}
                                <Grid item xs={12}>
                                    <Typography variant={'h5'}>Installation Instructions:</Typography>
                                    <List>
                                        {plugin.installationActionSet?.map(value => {
                                            return (
                                                <ListItem>
                                                    {value.description}
                                                </ListItem>)
                                        })}
                                    </List>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                        <AccordionActions>
                            <Button
                                variant="outlined"
                                color="primary"
                                style={{marginRight: '10px'}}
                                startIcon={<FileCopyOutlinedIcon/>}
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(plugin))
                                }}
                            >
                                export to clipboard
                            </Button>
                            <Button
                                disabled={plugin.isInstalled}
                                variant="outlined"
                                color="primary"
                                style={{marginRight: '10px'}}
                                startIcon={<AddOutlinedIcon/>}
                                onClick={() => this.installPlugin(plugin)}
                            >
                                Install
                            </Button>
                            {plugin.isInstalled && <Button
                                disabled={true}
                                variant="outlined"
                                color="primary"
                                style={{marginRight: '10px'}}
                                startIcon={<DeleteOutlinedIcon/>}
                            >
                                Uninstall
                            </Button>}
                        </AccordionActions>
                    </Accordion>
                )
            })}
        </>
    }
}

export default withStyles(styles)(Plugins);
