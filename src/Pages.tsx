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
  Toolbar
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import {Channel, Page} from "./api/models";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {convertPagesToTreeModelArray, TreeModel} from "./util";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";
import {ChannelPageOperationsApi} from "./api";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import PageAccordion from "./PageAccordion";

type PagesState = {
  channels: Array<Channel>
  currentPageTrees: Array<TreeModel>
  currentChannelId: string,
  dialogOpen: boolean
}
type PagesProps = {
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
    extends: {
      type: "string"
    },
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

class Pages extends React.Component<PagesProps, PagesState> {

  constructor (props: PagesProps) {
    super(props);

    this.state = {
      channels: [],
      currentChannelId: '',
      currentPageTrees: [],
      dialogOpen: false,
      // addPage: undefined
    }
  }

  componentDidMount (): void {
    this.updatePages();
  }

  updatePages () {
    const api = new ChannelOperationsApi({
      baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint)
    api.getChannels().then(value => {
      this.setState({channels: value.data},
        () => this.updatePagesByChannel(this.state.channels[0].id))
    });
  }

  updatePagesByChannel (channelId: string) {
    const api = new ChannelPageOperationsApi({
      baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint)
    api.getChannelPages(channelId).then(value => {
      this.setState({
        currentChannelId: channelId,
        // currentChannelPages: value.data,
        currentPageTrees: convertPagesToTreeModelArray(value.data)
      })
    });
  }

  render () {
    let addPage: Page = {
      name: '',
      type: 'page'
    };
    return <>
      <AppBar position="sticky" variant={'outlined'} color={'default'}>
        <Toolbar>
           <IconButton
             edge="start"
             color="inherit"
             aria-label="Add"
             onClick={() => this.openAddDialog()}
           >
            <AddOutlinedIcon/>
          </IconButton>
           <Divider/>
          <FormControl>
            <Select value={this.state.currentChannelId}>
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
          <Form onChange={({formData}) => addPage = formData} formData={addPage} schema={pageSchema as JSONSchema7}>
           <></>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.addPage(addPage)}>Add</Button>
          <Button color="primary" onClick={() => this.closeAddDialog()}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {this.state.currentPageTrees.map((treeModel, index) => {
        return (<PageAccordion key={index}
                               treeModel={treeModel}
                               onPageModelChange={page => this.onPageModelChanged(page)}
                               deletePage={page => this.deletePage(page)}
                               savePage={page => this.savePage(page)}/>)
      })}
    </>
  }

  addPage (addPage: Page) {
    const api = new ChannelPageOperationsApi({
      baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint)
    api.putChannelPage(this.state.currentChannelId, addPage.name, addPage).then(value => {
      this.updatePages();
      this.closeAddDialog();
    });
  }

  onPageModelChanged (page: Page) {
    console.log('page model changed', page);
  }

  deletePage (page: Page) {
    const api = new ChannelPageOperationsApi({
      baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint)
    api.deleteChannelPage(this.state.currentChannelId, page.name).then(value => {
      this.updatePages();
    });
  }

  savePage (page: Page) {
    const api = new ChannelPageOperationsApi({
      baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, this.props.endpoint);
    api.getChannelPage(this.state.currentChannelId, page.name).then(value => {
      api.putChannelPage(this.state.currentChannelId, page.name, page, value.headers['x-resource-version'])
        .then(() => {
          this.updatePages();
        })
    })
  }

  closeAddDialog () {
    this.setState({dialogOpen: false})
  }

  openAddDialog () {
    this.setState({dialogOpen: true})
  }

}

export default Pages;
