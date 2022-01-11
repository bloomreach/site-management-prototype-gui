import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Toolbar,
    Typography
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import AddOutlinedIcon from "@material-ui/icons/Add";
import ChannelSwitcher from "../common/ChannelSwitcher";
import {ChannelCatalogOperationsApi} from "../api/apis/channel-catalog-operations-api";
import {getChannelCatalogOperationsApi, getGenericSiteApi} from "../ApiContext";
import {CatalogGroup, ComponentDefinition} from "../api/models/site";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CatalogItem from "./CatalogItem";
import Form from "@rjsf/material-ui";
import {catalogGroupSchema, catalogGroupUiSchema, componentDefinitionSchema, slugify} from "./catalog-utils";
import {JSONSchema7} from "json-schema";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import {logError, logSuccess} from "../common/common-utils";
import {LogContext} from "../LogContext";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Icon from "@material-ui/core/Icon";
import {InstallationAction} from "../plugins/Plugins";

type CatalogGroupComponents = {
    group: string
    components: Array<ComponentDefinition>
}

type CatalogState = {
    currentChannelId: string,
    catalogGroupComponents: Array<CatalogGroupComponents>
    addGroupDialogOpen: boolean
    addComponentDialogOpen: boolean
    drawerOpen: boolean
    selectedGroupName?: string
}
type CatalogProps = {}

class Catalog extends React.Component<CatalogProps, CatalogState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: CatalogProps) {
        super(props);

        this.state = {
            currentChannelId: '',
            catalogGroupComponents: [],
            drawerOpen: false,
            addGroupDialogOpen: false,
            addComponentDialogOpen: false,
        };

        this.onChannelChanged = this.onChannelChanged.bind(this);
        this.deleteComponentDefinition = this.deleteComponentDefinition.bind(this);
        this.saveComponentDefinition = this.saveComponentDefinition.bind(this);
    }

    componentDidMount(): void {
        // this.updateCatalogs();
    }

    updateCatalogs(channelId: string) {
        if (this.state.currentChannelId !== null) {
            const catalogGroupComponents: Array<CatalogGroupComponents> = [];

            const api: ChannelCatalogOperationsApi = getChannelCatalogOperationsApi();
            // @ts-ignore
            api.getChannelCatalogGroups(this.state.currentChannelId).then(value => {
                const catalogGroups: Array<CatalogGroup> = value.data;
                catalogGroups.forEach(catalogGroup => {
                    // @ts-ignore
                    api.getChannelCatalogGroupComponents(this.state.currentChannelId, catalogGroup.name).then(response => {
                        catalogGroupComponents.splice(0, 0, {group: catalogGroup.name, components: response.data});
                    }).then(response => {
                        this.setState({catalogGroupComponents: catalogGroupComponents});
                    })
                });
            }).catch(error => {
                logError(`error retrieving component groups:  ${error?.response?.data}`, this.context); // error in the above string (in this case, yes)!
            });
            ;
        }
    }

    onChannelChanged(channelId: string) {
        this.setState({currentChannelId: channelId}, () => this.updateCatalogs(channelId));
    }

    render() {
        let currentCatalogGroup: CatalogGroup;
        let currentComponentDefinition: ComponentDefinition;
        return <>
            <AppBar position="sticky" variant={'outlined'} color={'default'}>
                <Toolbar>
                    <ChannelSwitcher onChannelChanged={channelId => this.onChannelChanged(channelId)}/>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<AddOutlinedIcon/>}
                        onClick={() => this.setState({addGroupDialogOpen: true})}>
                        Add Group
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
            {this.state.catalogGroupComponents.map((catalogGroupComponent: CatalogGroupComponents, key) => {
                return (
                    <Accordion key={this.state.currentChannelId + catalogGroupComponent.group}
                               onChange={(event, expanded) => console.log('on change of accordion', expanded)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography>Group: {catalogGroupComponent.group}</Typography>
                        </AccordionSummary>
                        <Toolbar>
                            <Button
                                variant="outlined"
                                color="primary"
                                style={{marginRight: '10px'}}
                                startIcon={<AddOutlinedIcon/>}
                                onClick={() => this.setState({
                                    addComponentDialogOpen: true,
                                    selectedGroupName: catalogGroupComponent.group
                                })}>
                                Add Component
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                style={{marginRight: '10px'}}
                                startIcon={<DeleteOutlinedIcon/>}
                                onClick={() => this.deleteCatalogGroup(catalogGroupComponent.group)}>
                                Delete Group
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                style={{marginRight: '10px'}}
                                startIcon={<FileCopyOutlinedIcon/>}
                                onClick={() => {
                                    const installationActions = this.createComponentGroups(catalogGroupComponent);
                                    navigator.clipboard.writeText(JSON.stringify(installationActions))
                                    const event = new CustomEvent('record', {detail: installationActions});
                                    document.dispatchEvent(event);
                                }}
                            >
                                export
                            </Button>

                        </Toolbar>
                        {catalogGroupComponent.components.map(componentDefinition => {
                            return (
                                <CatalogItem
                                    group={catalogGroupComponent.group}
                                    deleteComponentDefinition={this.deleteComponentDefinition}
                                    saveComponentDefinition={this.saveComponentDefinition}
                                    key={this.state.currentChannelId + catalogGroupComponent.group + componentDefinition.id}
                                    componentDefinition={componentDefinition}>
                                </CatalogItem>)
                        })}
                    </Accordion>)
            })}
            <Dialog open={this.state.addGroupDialogOpen}>
                <DialogTitle>Add Group</DialogTitle>
                <DialogContent>
                    <Form onChange={({formData}) => currentCatalogGroup = formData} uiSchema={catalogGroupUiSchema}
                          schema={catalogGroupSchema as JSONSchema7}>
                        <></>
                    </Form>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => {
                        this.addCatalogGroup(currentCatalogGroup, () => this.setState({addGroupDialogOpen: false}));
                    }}>OK</Button>
                    <Button color="primary" onClick={() => this.setState({addGroupDialogOpen: false})}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={this.state.addComponentDialogOpen}>
                <DialogTitle>Add Component</DialogTitle>
                <DialogContent>
                    <Form onChange={({formData}) => currentComponentDefinition = formData}
                          uiSchema={componentDefinitionSchema} schema={componentDefinitionSchema as JSONSchema7}>
                        <></>
                    </Form>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => {
                        this.addComponentDefinition(currentComponentDefinition, this.state.selectedGroupName, () => this.setState({addComponentDialogOpen: false}));
                    }}>OK</Button>
                    <Button color="primary"
                            onClick={() => this.setState({addComponentDialogOpen: false})}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    }

    private deleteComponentDefinition(componentDefinition: ComponentDefinition) {
        const api: ChannelCatalogOperationsApi = getChannelCatalogOperationsApi();
        const group = componentDefinition.id.split('/')[0];
        const name = componentDefinition.id.split('/')[1];
        this.state.currentChannelId && api.deleteChannelCatalogGroupComponent(this.state.currentChannelId, group, name).then(value => {
            this.updateCatalogs(this.state.currentChannelId);
        })
    }

    private saveComponentDefinition(componentDefinition: ComponentDefinition) {
        console.log('saving..', componentDefinition)
        const api: ChannelCatalogOperationsApi = getChannelCatalogOperationsApi();
        const group = componentDefinition.id.split('/')[0];
        const name = componentDefinition.id.split('/')[1];
        this.state.currentChannelId && api.getChannelCatalogGroupComponent(this.state.currentChannelId, group, name).then(response => {
            this.state.currentChannelId && api.putChannelCatalogGroupComponent(this.state.currentChannelId, group, name, componentDefinition, response.headers['x-resource-version']).then(response => {
                // this.updateCatalogs();
                logSuccess(`saved ${componentDefinition.id}`, this.context);
            }).catch(error => {
                console.log('reason', error?.response?.data);
                logError(`error saving component:  ${componentDefinition.id}: ${error?.response?.data}`, this.context); // error in the above string (in this case, yes)!
            })
        })

    }

    private addCatalogGroup(catalogGroup: CatalogGroup, callback?: () => any) {
        console.log('add catalog group', catalogGroup)
        const api: ChannelCatalogOperationsApi = getChannelCatalogOperationsApi();
        this.state.currentChannelId && api.putChannelCatalogGroup(this.state.currentChannelId, catalogGroup.name, catalogGroup).then(() => {
            this.updateCatalogs(this.state.currentChannelId);
            callback && callback();
        });
    }

    private addComponentDefinition(componentDefinition: ComponentDefinition, group?: string, callback?: () => any) {
        const api: ChannelCatalogOperationsApi = getChannelCatalogOperationsApi();
        if (componentDefinition.label) {
            let componentName = slugify(componentDefinition.label);
            const component = {...componentDefinition, id: `${group}/${componentName}`}
            this.state.currentChannelId && group &&
            api.putChannelCatalogGroupComponent(this.state.currentChannelId,
                group,
                componentName,
                component).then(() => {
                this.updateCatalogs(this.state.currentChannelId);
                callback && callback();
            }).catch(error => {
                logError(`error creating component: ${error?.response?.data}`, this.context); // error in the above string (in this case, yes)!
            });
        } else {
            logError(`error creating component: check required fields`, this.context); // error in the above string (in this case, yes)!
        }

    }

    private deleteCatalogGroup(catalogGroup: string) {
        const api: ChannelCatalogOperationsApi = getChannelCatalogOperationsApi();
        this.state.currentChannelId && catalogGroup &&
        api.deleteChannelCatalogGroup(this.state.currentChannelId,
            catalogGroup).then(() => {
            this.updateCatalogs(this.state.currentChannelId);
        });
    }

    private createComponentGroups(catalogGroupComponents: CatalogGroupComponents) {
        const installationActions: Array<InstallationAction> = catalogGroupComponents.components.map(component => {
            const body = {...component}
            return {
                type: 'site',
                path: `/channels/{channel_id}/component_groups/${catalogGroupComponents.group}/components/${slugify(component.label)}`,
                method: 'PUT',
                body: body,
                responseCode: 201,
                description: `create component: ${component.label}`
            } as InstallationAction
        })

        installationActions.unshift({
            type: 'site',
            path: `/channels/{channel_id}/component_groups/${catalogGroupComponents.group}`,
            method: 'PUT',
            body: {
                "name": catalogGroupComponents.group,
                "hidden": false,
                "system": false
            },
            responseCode: 201,
            description: `create group: ${catalogGroupComponents.group}`
        } as InstallationAction)

        return installationActions;
    }

    private importFromClipBoard() {
        navigator.clipboard.readText().then(value => {
            const installationActions: Array<InstallationAction> = JSON.parse(value);
            const isArray = Array.isArray(installationActions);
            const channelId = this.state.currentChannelId;
            const that = this;
            if (isArray) {
                (async function () {
                    const genericSiteApi = getGenericSiteApi();
                    let success = true;
                    let errors = []
                    for (const installationAction of installationActions) {
                        try {
                            const result = await genericSiteApi.put(installationAction.path, channelId, installationAction.body)
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
                    that.updateCatalogs(channelId)
                }).catch(reason => {
                    logError(reason.toString(), this.context);
                    that.updateCatalogs(channelId)
                })
            }
        });


    }
}

export default Catalog;
