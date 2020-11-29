import React from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography, withStyles
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import {Channel, Page} from "./api/models";
import {examplePages} from "./samples/Example";
import AddOutlinedIcon from "@material-ui/icons/Add";
import SortableTree from 'react-sortable-tree';
import {componentToNode} from "./util";
import NodeRendererDefault from "./fork/NodeRendererDefault";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";
import {ChannelPageOperationsApi} from "./api";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";

type PagesState = {
  channels: Array<Channel>
  currentChannelPages: Array<Page>
  currentChannelId: string,
  dialogOpen: boolean
}
type PagesProps = {
  classes: any
  endpoint: string
}

const pageSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      "enum": [
        "abstract",
        "page",
        "xpage",
      ], "enumNames": [
        "Abstract Page",
        "Page",
        "X Page",
      ]
    },
    name: {
      type: "string",
      "ui:disabled": true
    },
    description: {
      type: "string"
    },
    extends: {
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

class Pages extends React.Component<PagesProps, PagesState> {

  constructor (props: PagesProps) {
    super(props);

    this.state = {
      channels: [],
      currentChannelId: '',
      currentChannelPages: [],
      dialogOpen: false
    }
  }

  componentDidMount (): void {
    const api = new ChannelOperationsApi({
      // baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint)
    api.getChannels().then(value => {
      this.setState({channels: value.data}, () => this.updatePagesByChannel(this.state.channels[0].id))
    });
  }

  updatePagesByChannel (channelId: string) {
    const api = new ChannelPageOperationsApi({
      // baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint)
    api.getChannelPages(channelId).then(value => {
      this.setState({currentChannelId: channelId, currentChannelPages: value.data})
    });
  }


  render () {
    const {classes} = this.props;
    return <>
      <AppBar position="sticky" variant={'outlined'} color={'default'}>
        <Toolbar>
           <IconButton
             edge="start"
             color="inherit"
             aria-label="Add"
             // disabled={true}
             onClick={event => this.openAddDialog()}
           >
            <AddOutlinedIcon/>
          </IconButton>
           <Divider/>
          <FormControl>
            <Select
              value={this.state.currentChannelId}
              // displayEmpty
              inputProps={{'aria-label': 'Without label'}}>
             {this.state.channels.map(channel => {
               return <MenuItem key={channel.id} value={channel.id} onClick={() => this.updatePagesByChannel(channel.id)}>{channel.id}</MenuItem>
             })}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Dialog open={this.state.dialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle>Add Page</DialogTitle>
        <DialogContent>
          <Form schema={pageSchema as JSONSchema7}>
           <></>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button disabled color="primary">Add</Button>
          <Button color="primary" onClick={() => this.closeAddDialog()}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {this.state.currentChannelPages.map((page, index) => {
        // @ts-ignore
        return <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1c-content"
            id="panel1c-header">
            <Typography className={classes.heading}>name: {page.name}</Typography>
            <Typography className={classes.secondaryHeading}>type: {page.type}</Typography>
          </AccordionSummary>
          <AccordionDetails>

            <SortableTree style={{minHeight: '70px', width: '100%'}} reactVirtualizedListProps={{autoHeight: true}}
                          isVirtualized={false}
              // @ts-ignore
                          treeData={[componentToNode(page)]}

              // getNodeKey={{node} => node.id}
                          onChange={treeData => console.log(treeData)}
              // canNodeHaveChildren={node => (node.type !== 'container')}
              // onMoveNode={({treeData, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex}) =>
              //   this.onMove(treeData, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex)}
              // canDrag={({treeIndex}) => treeIndex !== 0}
              // canDrop={({nextParent}) => nextParent !== null}
              // @ts-ignore
                          nodeContentRenderer={NodeRendererDefault}
              // generateNodeProps={rowInfo => ({
              //   buttons: [rowInfo.node.type !== 'container' ? this.getStaticComponentMenu(rowInfo) :
              // this.getManageableComponentMenu(rowInfo)], rowLabelClickEventHandler: (event) =>
              // this.handleNodeClick(rowInfo) })}
            />
            <pre>{JSON.stringify(page, undefined, 2)}</pre>
          </AccordionDetails>
          <Divider/>
          <AccordionActions>
            <IconButton
              disabled={true}
              edge="start"
              color="inherit"
              aria-label="Delete"
              // onClick={event => this.deleteComponent(item)}
            >
              <DeleteOutlinedIcon/>
            </IconButton>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Save"
              // disabled={!item.changed}
              disabled={true}
              // onClick={event => this.handleSave(item)}
            >
              <SaveOutlinedIcon/>
            </IconButton>
          </AccordionActions>
        </Accordion>
      })}
    </>
  }

  closeAddDialog () {
    this.setState({dialogOpen: false})
  }

  openAddDialog () {
    this.setState({dialogOpen: true})
  }

}

export default withStyles(styles)(Pages);
