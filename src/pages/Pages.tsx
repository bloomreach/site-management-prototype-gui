import React from 'react';
import {AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Toolbar} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import {Channel, Page} from "../api/models";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {convertPagesToTreeModelArray, getPageSchema, TreeModel} from "./page-util";
import {ChannelPageOperationsApi} from "../api";
import Form from "@rjsf/material-ui";
import PageAccordion from "./PageAccordion";
import {channelPageOperationsApi} from "../ApiContext";
import ChannelSwitcher from "../common/ChannelSwitcher";
import {logError} from "../common/common-utils";
import {LogContext} from "../LogContext";

type PagesState = {
  channels: Array<Channel>
  currentPageTrees: Array<TreeModel>
  pages: Array<Page>
  currentChannelId: string,
  dialogOpen: boolean
}
type PagesProps = {}

class Pages extends React.Component<PagesProps, PagesState> {

  // static contextType: ApiContextType = ApiContext;
  static contextType = LogContext;
  context!: React.ContextType<typeof LogContext>;

  constructor (props: PagesProps) {
    super(props);

    this.state = {
      channels: [],
      pages: [],
      currentChannelId: '',
      currentPageTrees: [],
      dialogOpen: false,
    }
  }

  componentDidMount (): void {
  }

  updatePagesByChannel (channelId: string) {
    const api: ChannelPageOperationsApi = channelPageOperationsApi;
    api.getChannelPages(channelId).then(value => {
      this.setState({
        currentChannelId: channelId,
        pages: value.data,
        currentPageTrees: convertPagesToTreeModelArray(value.data)
      })
    }).catch(error => {
      logError(`error retrieving page layouts:  ${error?.response?.data}`, this.context); // error in the above string (in this case, yes)!
    });
  }

  private onChannelChanged (channelId: string) {
    this.setState({pages: [], currentPageTrees: []}, () => this.updatePagesByChannel(channelId));
  }

  render () {
    let addPage: Page = {
      name: '',
      type: 'page'
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
             onClick={() => this.openAddDialog()}>
            Add Page
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog open={this.state.dialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle>Add Page</DialogTitle>
        <DialogContent>
          <Form onChange={({formData}) => addPage = formData} formData={addPage} schema={getPageSchema(this.state.pages)}>
           <></>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.addPage(addPage)}>Add</Button>
          <Button color="primary" onClick={() => this.closeAddDialog()}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {this.state.currentPageTrees.map((treeModel, index) => {
        return (<PageAccordion key={treeModel.page.name + this.state.currentChannelId + index}
                               treeModel={treeModel}
                               onPageModelChange={page => this.onPageModelChanged(page)}
                               deletePage={page => this.deletePage(page)}
                               savePage={page => this.savePage(page)}/>)
      })}
    </>
  }

  addPage (addPage: Page) {
    const api: ChannelPageOperationsApi = channelPageOperationsApi;
    api.putChannelPage(this.state.currentChannelId, addPage.name, addPage).then(value => {
      this.updatePagesByChannel(this.state.currentChannelId);
      this.closeAddDialog();
    });
  }

  onPageModelChanged (page: Page) {
    console.log('page model changed', page);
  }

  deletePage (page: Page) {
    const api: ChannelPageOperationsApi = channelPageOperationsApi;
    api.deleteChannelPage(this.state.currentChannelId, page.name).then(value => {
      this.updatePagesByChannel(this.state.currentChannelId);
    });
  }

  savePage (page: Page) {
    const api: ChannelPageOperationsApi = channelPageOperationsApi;
    api.getChannelPage(this.state.currentChannelId, page.name).then(value => {
      api.putChannelPage(this.state.currentChannelId, page.name, page, value.headers['x-resource-version'])
        .then(() => {
          this.updatePagesByChannel(this.state.currentChannelId);
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
