import React from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Container,
  Divider,
  Drawer,
  Icon,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  withStyles
} from "@material-ui/core";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state/index";
import 'react-sortable-tree/style.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import SortableTree, {addNodeUnderParent, ExtendedNodeData, removeNode, TreeItem} from 'react-sortable-tree';
import {componentToNode, ComponentTreeItem, getNodeKey, TreeModel} from "./util";
import NodeRendererDefault from "./fork/NodeRendererDefault";
import {Delete} from "@material-ui/icons";
import {AbstractComponent} from "./api/models";
import {JSONSchema7} from "json-schema";
import Form from "@rjsf/material-ui";

type PageState = {
  treeData: ComponentTreeItem[] | TreeItem[]
  saveDisabled: boolean
  drawerOpen: boolean
  selectedNode?: ComponentTreeItem
}
type PageProps = {
  classes: any
  treeModel: TreeModel
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

const componentSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    description: {
      type: "string"
    },
    parameters: {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
};

class PageAccordion extends React.Component<PageProps, PageState> {

  constructor (props: PageProps) {
    super(props);

    this.state = {
      treeData: props.treeModel.treeData,
      saveDisabled: true,
      drawerOpen: false,
      selectedNode: undefined
    }
  }

  componentDidMount (): void {
  }

  getMenu (rowInfo: ExtendedNodeData) {
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
            <MenuItem disabled={rowInfo.treeIndex === 0} onClick={() => this.deleteComponent(rowInfo, () => popupState.close())}>
              <ListItemIcon>
                <Delete fontSize="small"/>
              </ListItemIcon>
              <Typography variant="inherit">Delete Component</Typography>
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  }

  addComponent (rowInfo: ExtendedNodeData, type: string, callback?: () => void) {
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
      }
    });
  }

  onComponentChanged (component: AbstractComponent, node?: ComponentTreeItem) {
    if (node !== undefined) {
      node.component = component;
      node.title = component.name;
      this.setState({treeData: this.state.treeData});
    }
  }

  onComponentSelected (node: ComponentTreeItem) {
    this.setState({drawerOpen: true, selectedNode: node})
  }

  render () {
    const {classes} = this.props;
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>name: {this.props.treeModel.page.name}</Typography>
          <Typography className={classes.secondaryHeading}>type: {this.props.treeModel.page.type}</Typography>
        </AccordionSummary>
        <Divider/>
        <AccordionDetails>
          <SortableTree style={{minHeight: '70px', width: '100%'}}
                        reactVirtualizedListProps={{autoHeight: true}}
                        isVirtualized={false}
                        treeData={this.state.treeData}
                        getNodeKey={getNodeKey}
                        onChange={treeData => {
                          // @ts-ignore
                          this.setState({treeData, saveDisabled: false});
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
        </AccordionDetails>
        <Drawer anchor={'right'} open={this.state.drawerOpen}
                onClose={() => this.setState({drawerOpen: false})}>
          {this.state.selectedNode &&
          <Container>
            <Form onChange={({formData}) => this.onComponentChanged(formData, this.state.selectedNode)} schema={componentSchema as JSONSchema7} formData={this.state.selectedNode.component}>
              <></>
            </Form>
          </Container>
          }
        </Drawer>
        <Divider/>
        <AccordionActions>
          <IconButton
            disabled={false}
            edge="start"
            color="inherit"
            aria-label="Delete"
            onClick={(event) => console.log('deleting', this.props.treeModel.page.name)}
          >
            <DeleteOutlinedIcon/>
          </IconButton>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Save"
            // disabled={!item.changed}
            disabled={this.state.saveDisabled}
            onClick={(event) => this.setState({saveDisabled: true}, () => console.log('saving', this.props.treeModel.page.name))}
          >
            <SaveOutlinedIcon/>
          </IconButton>
        </AccordionActions>
      </Accordion>)
  }

  deleteComponent (rowInfo: ExtendedNodeData, callback?: () => void) {
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
      }
    });

  }
}

export default withStyles(styles)(PageAccordion);