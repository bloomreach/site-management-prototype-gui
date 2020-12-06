import React from 'react';
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  withStyles
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import {Channel, Page} from "./api/models";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {convertPagesToTreeDataArray, TreeModel} from "./util";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";
import {ChannelPageOperationsApi} from "./api";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import PageAccordion from "./PageAccordion";

type PagesState = {
  channels: Array<Channel>
  currentChannelPages: Array<Page>
  currentPageTrees: Array<TreeModel>
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
      "enum":
        [
          "abstract",
          "page",
          "xpage",
        ],
      "enumNames":
        [
          "Abstract Page",
          "Page",
          "X Page",
        ]
    },
    name: {
      type: "string",
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
      currentPageTrees: [],
      dialogOpen: false
    }
  }

  componentDidMount (): void {
    const api = new ChannelOperationsApi({
      baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint)
    api.getChannels().then(value => {
      this.setState({channels: value.data}, () => this.updatePagesByChannel(this.state.channels[0].id))
    });
  }

  updatePagesByChannel (channelId: string) {
    const api = new ChannelPageOperationsApi({
      baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint)
    api.getChannelPages(channelId).then(value => {
      this.setState({
        currentChannelId: channelId,
        currentChannelPages: value.data,
        currentPageTrees: convertPagesToTreeDataArray(value.data)
      })
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
      {this.state.currentPageTrees.map((treeModel, index) => {
        return (<PageAccordion key={index} treeModel={treeModel}/>)
      })}
    </>
  }

  closeAddDialog () {
    this.setState({dialogOpen: false})
  }

  openAddDialog () {
    this.setState({dialogOpen: true})
  }

  onMove ({treeData, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex}: { treeData: any, node: any, nextParentNode: any, prevPath: any, prevTreeIndex: any, nextPath: any, nextTreeIndex: any }) {
    console.log(node);
    console.log(nextParentNode);
    console.log(prevPath);
    console.log(prevTreeIndex);
    console.log(nextPath);
    console.log(nextTreeIndex);
  }

}

export default withStyles(styles)(Pages);
