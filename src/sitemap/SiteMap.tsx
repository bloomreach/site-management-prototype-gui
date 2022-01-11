import React from 'react';
import {
    AppBar,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    Icon,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import {Channel, SitemapItem} from "../api/models/site";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {getChannelSiteMapOperationsApi, getGenericSiteApi} from "../ApiContext";
import {Nullable} from "../api/models/site/nullable";
import {ChannelSitemapOperationsApi} from "../api/apis/channel-sitemap-operations-api";
import SortableTree, {addNodeUnderParent, ExtendedNodeData, removeNode, TreeItem} from "react-sortable-tree";
import {
    convertSiteMapToTreeData,
    hasWildCardOrReserved,
    nodeToSiteMapItems,
    replaceWildCards,
    simpleSiteMapItemSchema,
    siteMapItemSchema,
    siteMapItemToTreeItem,
    siteMapItemUiSchema
} from "./sitemap-utils";
import {getNodeKey, isNotEmptyOrNull, logError} from "../common/common-utils";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import SiteMapItemNodeRendererDefault from "./SiteMapItemNodeRendererDefault";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import {Delete} from "@material-ui/icons";
import ChannelSwitcher from "../common/ChannelSwitcher";
import {LogContext} from "../LogContext";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import {InstallationAction} from "../plugins/Plugins";
import {slugify} from "../catalog/catalog-utils";

type SiteMapState = {
    channels: Array<Channel>
    currentChannelId: string,
    dialogOpen: boolean
    treeData: TreeItem[]
    drawerOpen: boolean
    selectedNode?: TreeItem
}
type SiteMapProps = {}

class SiteMap extends React.Component<SiteMapProps, SiteMapState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: SiteMapProps) {
        super(props);

        this.state = {
            channels: [],
            currentChannelId: '',
            treeData: [],
            drawerOpen: false,
            selectedNode: undefined,
            dialogOpen: false
        }
    }

    componentDidMount(): void {

    }

    updateSiteMapByChannel(channelId: string) {
        const api: ChannelSitemapOperationsApi = getChannelSiteMapOperationsApi();
        api.getChannelSitemap(channelId).then(value => {
            this.setState({
                currentChannelId: channelId,
                treeData: convertSiteMapToTreeData(value.data)
            }, () => console.log(this.state.treeData));
        }).catch(error => {
            logError(`error retrieving routes:  ${error?.response?.data}`, this.context); // error in the above string (in this case, yes)!
        });
        ;
    }

    getMenu(rowInfo: ExtendedNodeData) {
        const siteMapItem: SitemapItem = rowInfo.node.siteMapItem;
        return rowInfo.node.siteMapItem.name !== 'home' && <PopupState variant="popover" popupId="component-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <MoreHorizOutlinedIcon {...bindTrigger(popupState)}/>
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem
                            onClick={() => this.addSiteMapItem(rowInfo, "new-sitemap-item", () => popupState.close())}>
                            <ListItemIcon>
                                <Icon style={{width: '1.25em'}} className="fa fa-sitemap" fontSize={'small'}/>
                            </ListItemIcon>
                            <Typography variant="inherit">Add Custom Matcher</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => this.addSiteMapItem(rowInfo, "_index_", () => popupState.close())}>
                            <ListItemIcon>
                                <Icon style={{width: '1.25em'}} className="fa fa-sitemap" fontSize={'small'}/>
                            </ListItemIcon>
                            <Typography variant="inherit">Add ./ Matcher (_index_)</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => this.addSiteMapItem(rowInfo, "_any_", () => popupState.close())}>
                            <ListItemIcon>
                                <Icon style={{width: '1.25em'}} className="fa fa-sitemap" fontSize={'small'}/>
                            </ListItemIcon>
                            <Typography variant="inherit">Add ** Matcher (_any_)</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => this.addSiteMapItem(rowInfo, "_default_", () => popupState.close())}>
                            <ListItemIcon>
                                <Icon style={{width: '1.25em'}} className="fa fa-sitemap" fontSize={'small'}/>
                            </ListItemIcon>
                            <Typography variant="inherit">Add * Matcher (_default_)</Typography>
                        </MenuItem>
                        <MenuItem disabled={(siteMapItem.name === 'home') || (siteMapItem.name === 'root')}
                                  onClick={() => this.deleteSiteMapItem(rowInfo, () => popupState.close())}>
                            <ListItemIcon>
                                <Delete fontSize="small"/>
                            </ListItemIcon>
                            <Typography variant="inherit">Delete Route</Typography>
                        </MenuItem>
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    }

    render() {
        let addSiteMapItem: SitemapItem = {
            name: '',
        };
        return <>
            <AppBar position="sticky" variant={'outlined'} color={'default'}>
                <Toolbar>
                    <ChannelSwitcher onChannelChanged={channelId => this.onChannelChanged(channelId)}/>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<AddOutlinedIcon/>}
                        onClick={() => this.setState({dialogOpen: true})}
                    >
                        Add Route
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<SaveOutlinedIcon/>}
                        onClick={() => this.saveSiteMap()}
                    >
                        Save Routes
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<FileCopyOutlinedIcon/>}
                        onClick={() => {
                            const installationActions = this.createSitemapExport();
                            navigator.clipboard.writeText(JSON.stringify(installationActions))
                            const event = new CustomEvent('record', { detail: installationActions });
                            document.dispatchEvent(event);
                        }}
                    >
                        export routes
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<Icon className="fas fa-paste"/>}
                        onClick={() => this.importFromClipBoard()}
                    >
                        import
                    </Button>
                </Toolbar>
            </AppBar>
            <Dialog open={this.state.dialogOpen} aria-labelledby="form-dialog-title">
                <DialogTitle>Add Route</DialogTitle>
                <DialogContent>
                    <Form onChange={({formData}) => addSiteMapItem = formData} formData={addSiteMapItem}
                          uiSchema={siteMapItemUiSchema} schema={simpleSiteMapItemSchema as JSONSchema7}>
                        <></>
                    </Form>
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                            onClick={() => this.addSiteMapItem(null, addSiteMapItem.name, () => this.setState({dialogOpen: false}, () => {/*this.state.currentChannelId && this.updateSiteMapByChannel(this.state.currentChannelId)*/
                            }))}>Add</Button>
                    <Button color="primary" onClick={() => this.setState({dialogOpen: false})}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Container>
                {isNotEmptyOrNull(this.state.treeData) &&
                <SortableTree style={{minHeight: '70px', width: '100%'}}
                              reactVirtualizedListProps={{autoHeight: true}}
                              isVirtualized={false}
                              treeData={this.state.treeData}
                              getNodeKey={getNodeKey}
                              onChange={treeData => {
                                  this.setState({treeData: treeData});
                              }}
                              canNodeHaveChildren={node => (node.siteMapItem.name !== 'root' && node.siteMapItem.name !== 'home' && !node.siteMapItem.name.includes('_any_'))}
                    // @ts-ignore
                              nodeContentRenderer={SiteMapItemNodeRendererDefault}
                              generateNodeProps={rowInfo => ({


                                  buttons: [
                                      this.getMenu(rowInfo)
                                  ],
                                  rowLabelClickEventHandler: () =>
                                      this.onNodeSelected(rowInfo.node)
                              })}
                />
                }
            </Container>
            <Drawer anchor={'right'} open={this.state.drawerOpen}
                    onClose={() => this.setState({drawerOpen: false})}>
                {this.state.selectedNode &&
                <>
                    <AppBar position="static" color={"default"}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu"
                                        onClick={() => this.setState({drawerOpen: false})}>
                                <ChevronRightIcon/>
                            </IconButton>
                            <Typography variant="h6">
                                Route Editor
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Container>
                        <Form onChange={({formData}) => this.onSiteMapItemChanged(formData, this.state.selectedNode)}
                              schema={siteMapItemSchema as JSONSchema7} uiSchema={siteMapItemUiSchema}
                              formData={this.state.selectedNode.siteMapItem}>
                            <></>
                        </Form>
                    </Container></>
                }
            </Drawer>
        </>
    }

    saveSiteMap() {
        const siteMap: SitemapItem[] = nodeToSiteMapItems(this.state.treeData);
        const api: ChannelSitemapOperationsApi = getChannelSiteMapOperationsApi();

        this.state.currentChannelId &&

        siteMap.forEach(siteMapItem => {
            // @ts-ignore
            api.getChannelSitemapItem(this.state.currentChannelId, siteMapItem.name).then(value => {
                // @ts-ignore
                api.putChannelSitemapItem(this.state.currentChannelId, siteMapItem.name, siteMapItem, value.headers['x-resource-version']).catch(error => {
                    console.error('error with routes 1', error)
                    logError(`error saving route:  ${siteMapItem.name}: ${error?.response?.data}`, this.context);
                });
            }).catch(reason => {
                // @ts-ignore
                api.putChannelSitemapItem(this.state.currentChannelId, siteMapItem.name, siteMapItem).catch(error => {
                    console.error('error with routes 2', error)
                    logError(`error saving route:  ${siteMapItem.name}: ${error?.response?.data}`, this.context);
                });
            });
        });

        // this.state.currentChannelId && this.updateSiteMapByChannel(this.state.currentChannelId);
    }

    onSiteMapChanged() {
        const siteMap: SitemapItem[] = nodeToSiteMapItems(this.state.treeData);
        console.log('fullSitemap', siteMap);
    }

    onNodeSelected(node: TreeItem) {
        this.setState({drawerOpen: true, selectedNode: node})
    }

    onSiteMapItemChanged(siteMapItem: SitemapItem, node?: TreeItem) {
        if (node !== undefined) {
            node.siteMapItem = siteMapItem;
            node.title = `/${replaceWildCards(siteMapItem.name)}`;
            node.subtitle = hasWildCardOrReserved(siteMapItem.name) && `/${siteMapItem.name}`;
            this.setState({treeData: this.state.treeData},
                () => this.onSiteMapChanged());
        }
    }

    private addSiteMapItem(rowInfo: Nullable<ExtendedNodeData>, name: string, callback: () => any) {
        console.log('add item', rowInfo);
        const newSiteMapItem: SitemapItem = {
            name: `${name}`
        };
        const newNodeSiteMapItem: TreeItem = siteMapItemToTreeItem(newSiteMapItem);

        const treeData: TreeItem[] = addNodeUnderParent({
            treeData: this.state.treeData,
            parentKey: rowInfo && rowInfo.node.id,
            expandParent: true,
            getNodeKey,
            newNode: newNodeSiteMapItem,
            addAsFirstChild: true,
        }).treeData;

        this.setState({treeData: treeData}, () => {
            this.onNodeSelected(newNodeSiteMapItem);
            if (callback) {
                callback();
                this.onSiteMapChanged();
            }
        });

    }

    private deleteSiteMapItem(rowInfo: ExtendedNodeData, callback: () => any) {
        console.log('row delete', rowInfo);
        // @ts-ignore
        const treeData: TreeItem[] = removeNode({
            treeData: this.state.treeData,
            path: rowInfo.path,
            getNodeKey,
            ignoreCollapsed: true
        }).treeData;

        this.setState({treeData: treeData}, () => {
            if (callback) {
                callback();
                if (rowInfo.parentNode === null) {
                    const api: ChannelSitemapOperationsApi = getChannelSiteMapOperationsApi();
                    const siteMapItem = rowInfo.node.siteMapItem;
                    // @ts-ignore
                    api.deleteChannelSitemapItem(this.state.currentChannelId, siteMapItem.name).then(() => {
                        this.onSiteMapChanged();
                    })
                }
            }
        });
    }

    private onChannelChanged(channelId: string) {
        this.updateSiteMapByChannel(channelId);
    }

    private createSitemapExport() {
        const siteMap: SitemapItem[] = nodeToSiteMapItems(this.state.treeData);

        const installationActions: Array<InstallationAction> = siteMap.map(route => {
            const body = {...route}
            return {
                type: 'site',
                path: `/channels/{channel_id}/routes/${route.name}`,
                method: 'PUT',
                body: body,
                responseCode: 201,
                description: `create route: ${route.name}`
            } as InstallationAction
        })

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
                    that.updateSiteMapByChannel(channelId)
                }).catch(reason => {
                    logError(reason.toString(), this.context);
                    that.updateSiteMapByChannel(channelId)
                })
            }
        });


    }
}

export default SiteMap;
