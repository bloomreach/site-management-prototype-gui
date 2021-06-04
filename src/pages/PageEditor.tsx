import React from 'react';
import {
    AppBar,
    Container, Divider,
    Drawer,
    Icon,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state/index";
import 'react-sortable-tree/style.css';
import SortableTree, {addNodeUnderParent, ExtendedNodeData, removeNode, TreeItem} from 'react-sortable-tree';
import {
    componentToNode,
    ComponentTreeItem,
    getSchemaForComponentType,
    nodeToComponent,
    TreeModel,
    validateComponent
} from "./page-util";
import NodeRendererDefault from "./NodeRendererDefault";
import {Delete} from "@material-ui/icons";
import {AbstractComponent, Page} from "../api/models";
import {JSONSchema7} from "json-schema";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Form from "@rjsf/material-ui";
import {getNodeKey, logError} from "../common/common-utils";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import {LogContext} from "../LogContext";


type PageEditorState = {
    treeData: ComponentTreeItem[] | TreeItem[]
    drawerOpen: boolean
    selectedNode?: ComponentTreeItem
}
type PageEditorProps = {
    treeModel: TreeModel
    onPageModelChange: (page: Page) => void
}

class PageEditor extends React.Component<PageEditorProps, PageEditorState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: PageEditorProps) {
        super(props);

        this.state = {
            treeData: props.treeModel.treeData,
            drawerOpen: false,
            selectedNode: undefined
        }
    }

    componentDidMount(): void {
    }

    getMenu(rowInfo: ExtendedNodeData) {
        const type = rowInfo.node.component.type;
        const isNotManagedComponent = (type !== 'managed');
        return <PopupState variant="popover" popupId="component-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <MoreHorizOutlinedIcon {...bindTrigger(popupState)}/>
                    <Menu {...bindMenu(popupState)}>
                        {isNotManagedComponent &&
                        <MenuItem onClick={() => this.addComponent(rowInfo, "static", () => popupState.close())}>
                            <ListItemIcon>
                                <Icon className="fa fa-puzzle-piece" fontSize={'small'}/>
                            </ListItemIcon>
                            <Typography variant="inherit">Add Static Component</Typography>
                        </MenuItem>}
                        {isNotManagedComponent &&
                        <MenuItem onClick={() => this.addComponent(rowInfo, "managed", () => popupState.close())}>
                            <ListItemIcon>
                                <Icon className="fa fa-columns" fontSize={'small'}/>
                            </ListItemIcon>
                            <Typography variant="inherit">Add Managed Component</Typography>
                        </MenuItem>}
                        <MenuItem disabled={rowInfo.treeIndex === 0}
                                  onClick={() => this.deleteComponent(rowInfo, () => popupState.close())}>
                            <ListItemIcon>
                                <Delete fontSize="small"/>
                            </ListItemIcon>
                            <Typography variant="inherit">Delete Component</Typography>
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={() => this.copyComponentToClipBoard(rowInfo, () => popupState.close())}>
                            <ListItemIcon>
                                <FileCopyOutlinedIcon fontSize="small"/>
                            </ListItemIcon>
                            <Typography variant="inherit">Copy to Clipboard</Typography>
                        </MenuItem>
                        {isNotManagedComponent &&
                        <MenuItem onClick={() => this.pasteFromClipBoard(rowInfo, () => popupState.close())}>
                            <ListItemIcon>
                                <Icon className="fas fa-paste" fontSize={'small'}/>
                            </ListItemIcon>
                            <Typography variant="inherit">Paste from Clipboard</Typography>
                        </MenuItem>}
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    }

    addComponent(rowInfo: ExtendedNodeData, type: string, callback?: () => void) {
        const newNode: AbstractComponent = {
            type: type,
            name: `new-${type}-component`
        }
        const newNodeComponent: ComponentTreeItem = componentToNode(newNode);

        const treeData: TreeItem[] = addNodeUnderParent({
            treeData: this.state.treeData,
            parentKey: rowInfo.node.id,
            expandParent: true,
            getNodeKey,
            newNode: newNodeComponent,
            addAsFirstChild: true,
        }).treeData;

        this.setState({treeData: treeData}, () => {
            this.onComponentSelected(newNodeComponent);
            if (callback) {
                callback();
                this.onPageModelChanged();
            }
        });
    }

    onComponentChanged(component: AbstractComponent, node?: ComponentTreeItem) {
        if (node !== undefined) {
            node.component = component;
            node.title = component.name;
            this.setState({treeData: this.state.treeData},
                () => this.onPageModelChanged());
        }
    }

    onPageModelChanged() {
        const page: Page = nodeToComponent(this.state.treeData[0] as ComponentTreeItem);
        this.props.onPageModelChange(page);
    }

    onComponentSelected(node: ComponentTreeItem) {
        this.setState({drawerOpen: true, selectedNode: node})
    }

    render() {
        return (<>
            <SortableTree style={{minHeight: '70px', width: '100%'}}
                          reactVirtualizedListProps={{autoHeight: true}}
                          isVirtualized={false}
                          treeData={this.state.treeData}
                          getNodeKey={getNodeKey}
                          onChange={treeData => {
                              this.setState({treeData: treeData}, () => {
                                  this.onPageModelChanged();
                              });
                          }}
                          canNodeHaveChildren={node => (node.component.type !== 'managed')}
                          canDrag={({treeIndex}) => treeIndex !== 0}
                          canDrop={({nextParent}) => nextParent !== null}
                // @ts-ignore
                          nodeContentRenderer={NodeRendererDefault}
                          generateNodeProps={rowInfo => ({
                              buttons: [
                                  this.getMenu(rowInfo)
                              ],
                              rowLabelClickEventHandler: () =>
                                  this.onComponentSelected((rowInfo.node) as ComponentTreeItem)
                          })}
            />

            <Drawer anchor={'right'} open={this.state.drawerOpen}
                    onClose={() => this.setState({drawerOpen: false})}>
                {this.state.selectedNode &&
                <>
                    <AppBar position="static" color={"default"}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="close drawer"
                                        onClick={() => this.setState({drawerOpen: false})}>
                                <ChevronRightIcon/>
                            </IconButton>
                            <Typography variant="h6">
                                Component Editor
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Container>
                        <Form onChange={({formData}) => this.onComponentChanged(formData, this.state.selectedNode)}
                              schema={getSchemaForComponentType(this.state.selectedNode?.component.type) as JSONSchema7}
                              formData={this.state.selectedNode.component}>
                            <></>
                        </Form>
                    </Container></>
                }
            </Drawer>
        </>)
    }

    deleteComponent(rowInfo: ExtendedNodeData, callback?: () => void) {
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
                this.onPageModelChanged();
            }
        });

    }

    //experimental feature
    pasteFromClipBoard(rowInfo: ExtendedNodeData, callback?: () => void) {
        navigator.clipboard.readText().then(value => {
            console.log(' clipboard ', value);
            let ob;
            try {
                ob = JSON.parse(value);
                let validatorResult = validateComponent(ob);
                console.log(' validate ', validatorResult.valid);
                if (validatorResult.valid) {
                    const newNodeComponent: ComponentTreeItem = componentToNode(ob);
                    const treeData: TreeItem[] = addNodeUnderParent({
                        treeData: this.state.treeData,
                        parentKey: rowInfo.node.id,
                        expandParent: true,
                        getNodeKey,
                        newNode: newNodeComponent,
                        addAsFirstChild: true,
                    }).treeData;
                    this.setState({treeData: treeData}, () => {
                        if (callback) {
                            callback();
                            this.onPageModelChanged();
                        }
                    });
                } else {
                    throw validatorResult.errors;
                }
            } catch (e) {
                logError('error importing object: ' + e, this.context); // error in the above string (in this case, yes)!
                if (callback) {
                    callback();
                }
            }

        });
    }

    copyComponentToClipBoard(rowInfo: ExtendedNodeData, callback?: () => void) {
        // @ts-ignore
        const componentCopy = nodeToComponent(rowInfo.node);
        console.log('copy to clipboard', componentCopy);
        navigator.clipboard.writeText(JSON.stringify(componentCopy));
        if (callback) {
            callback();
        }
    }
}

export default PageEditor;