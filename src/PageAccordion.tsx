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
import SortableTree, {ExtendedNodeData} from 'react-sortable-tree';
import {ComponentTreeItem, TreeModel} from "./util";
import NodeRendererDefault from "./fork/NodeRendererDefault";
import {Delete} from "@material-ui/icons";
import {AbstractComponent, ManagedComponent, Page, StaticComponent} from "./api/models";
import {Nullable} from "./api/models/nullable";
import {JSONSchema7} from "json-schema";
import Form from "@rjsf/material-ui";

type PageState = {
  treeData: ComponentTreeItem[]
  saveDisabled: boolean
  drawerOpen: boolean
  selectedComponent: Nullable<Page | StaticComponent | ManagedComponent | AbstractComponent>
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
      selectedComponent: null
    }
  }

  componentDidMount (): void {
    // const api = new ChannelOperationsApi({
    //   baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    // }, this.props.endpoint)
    // api.getChannels().then(value => {
    //   this.setState({channels: value.data}, () => this.updatePagesByChannel(this.state.channels[0].id))
    // });
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
            <MenuItem
              // onClick={event => this.add(rowInfo, popupState, false, newNode)} key={key}
            >
              <ListItemIcon>
                <Icon className="fa fa-puzzle-piece" fontSize={'small'}/>
              </ListItemIcon>
              <Typography variant="inherit">Add Static Component</Typography>
            </MenuItem>}
            {isNotManagedComponent &&
            <MenuItem
              // onClick={event => this.add(rowInfo, popupState, false, newNode)} key={key}
            >
              <ListItemIcon>
                <Icon className="fa fa-columns" fontSize={'small'}/>
              </ListItemIcon>
              <Typography variant="inherit">Add Managed Component</Typography>
            </MenuItem>
            }
            <MenuItem disabled={rowInfo.treeIndex === 0} onClick={event => console.log(rowInfo, popupState)}>
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

  onComponentSelected (rowInfo: ExtendedNodeData) {
    console.log(rowInfo);
    console.log(rowInfo.node.component);
    this.setState({drawerOpen: true, selectedComponent: rowInfo.node.component})
  }

  render () {
    const {classes} = this.props;
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
         >
          <Typography className={classes.heading}>name: {this.props.treeModel.page.name}</Typography>
          <Typography className={classes.secondaryHeading}>type: {this.props.treeModel.page.type}</Typography>
        </AccordionSummary>
        <Divider/>
        {/*<Sidebar.Pushable raised>*/}
        {/*  <Sidebar*/}
        {/*    animation='overlay'*/}
        {/*    icon='labeled'*/}
        {/*    as={Container}*/}
        {/*    style={{background: 'white'}}*/}
        {/*    // inverted*/}
        {/*    onHide={() => this.setState({drawerOpen: false})}*/}
        {/*    // vertical*/}
        {/*    visible={this.state.drawerOpen}*/}
        {/*    width='wide'*/}
        {/*    direction={"right"}*/}
        {/*  >*/}
        {/*    {this.state.selectedComponent &&*/}
        {/*    <Form onChange={({formData})=> console.log(formData)} schema={componentSchema as JSONSchema7} formData={this.state.selectedComponent}>*/}
        {/*      <></>*/}
        {/*    </Form>*/}
        {/*    }*/}
        {/*  </Sidebar>*/}
        {/*  <Sidebar.Pusher dimmed={this.state.drawerOpen}>*/}
        <AccordionDetails>
          <SortableTree style={{minHeight: '70px', width: '100%'}} reactVirtualizedListProps={{autoHeight: true}}
                        isVirtualized={false}
                        treeData={this.state.treeData}
                        getNodeKey={({node}) => node.id}
                        onChange={treeData => {
                          // @ts-ignore
                          this.setState({treeData, saveDisabled: false});
                        }}
                        canNodeHaveChildren={node => (node.component.type !== 'managed')}
            // onMoveNode={({treeData, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex}) =>
            //   this.onMove({
            //     treeData: treeData,
            //     node: node,
            //     nextParentNode: nextParentNode,
            //     prevPath: prevPath,
            //     prevTreeIndex: prevTreeIndex,
            //     nextPath: nextPath,
            //     nextTreeIndex: nextTreeIndex
            //   })}
                        canDrag={({treeIndex}) => treeIndex !== 0}
                        canDrop={({nextParent}) => nextParent !== null}
            // @ts-ignore
                        nodeContentRenderer={NodeRendererDefault}
                        generateNodeProps={rowInfo => ({
                          buttons: [
                            this.getMenu(rowInfo)
                          ],
                          rowLabelClickEventHandler: () =>
                            this.onComponentSelected(rowInfo)
                        })}
          />
        </AccordionDetails>
        <Drawer anchor={'right'} open={this.state.drawerOpen}
                onClose={() => this.setState({drawerOpen: false})}>
          {this.state.selectedComponent &&
          <Container>
            <Form onChange={({formData}) => console.log(formData)} schema={componentSchema as JSONSchema7} formData={this.state.selectedComponent}>
              <></>
            </Form>
          </Container>
          }
        </Drawer>
        {/*  </Sidebar.Pusher>*/}
        {/*</Sidebar.Pushable>*/}
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

  onMove ({treeData, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex}: { treeData: any, node: any, nextParentNode: any, prevPath: any, prevTreeIndex: any, nextPath: any, nextTreeIndex: any }) {
    // console.log(node);
    // console.log(nextParentNode);
    // console.log(prevPath);
    // console.log(prevTreeIndex);
    // console.log(nextPath);
    // console.log(nextTreeIndex);
  }

}

export default withStyles(styles)(PageAccordion);