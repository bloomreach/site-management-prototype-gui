import React from 'react';
import {
  AppBar,
  Container,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import {Channel, Page, SitemapItem} from "./api/models";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";
import {channelOperationsApi, channelSiteMapOperationsApi} from "./ApiContext";
import {Nullable} from "./api/models/nullable";
import {ChannelSitemapOperationsApi} from "./api/apis/channel-sitemap-operations-api";
import SortableTree, {TreeItem} from "react-sortable-tree";
import {
  convertSiteMapToTreeData,
  hasWildCardOrReserved,
  nodeToSiteMapItems,
  replaceWildCards
} from "./sitemap/sitemap-utils";
import {ComponentTreeItem, getNodeKey, isNotEmptyOrNull, nodeToComponent} from "./util";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import NodeRendererDefault from "./fork/NodeRendererDefault";
import SiteMapItemNodeRendererDefault from "./sitemap/SiteMapItemNodeRendererDefault";

type SiteMapState = {
  channels: Array<Channel>
  currentChannelId: Nullable<string>,
  // currentSiteMap: Array<SitemapItem>
  treeData: TreeItem[]
  drawerOpen: boolean
  // selectedSiteMapItem: Nullable<SitemapItem>
  selectedNode?: TreeItem
}
type SiteMapProps = {
  // endpoint: string
}

const siteMapItemSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    pageTitle: {
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

class SiteMap extends React.Component<SiteMapProps, SiteMapState> {

  // static contextType: ApiContextType = ApiContext;

  constructor (props: SiteMapProps) {
    super(props);

    this.state = {
      channels: [],
      currentChannelId: null,
      // currentSiteMap: [],
      treeData: [],
      drawerOpen: false,
      // selectedSiteMapItem: null,
      selectedNode: undefined
    }
  }

  componentDidMount (): void {
    this.updateSiteMap();
  }

  updateSiteMap () {
    if (this.state.currentChannelId === null) {
      const api: ChannelOperationsApi = channelOperationsApi;
      api.getChannels().then(value => {
        this.setState({channels: value.data},
          () => this.updateSiteMapByChannel(this.state.channels[0].id))
      });
    }
  }

  updateSiteMapByChannel (channelId: string) {
    const api: ChannelSitemapOperationsApi = channelSiteMapOperationsApi;
    api.getChannelSitemap(channelId).then(value => {
      this.setState({
        currentChannelId: channelId,
        // currentSiteMap: value.data,
        treeData: convertSiteMapToTreeData(value.data)
        // currentPageTrees: convertPagesToTreeModelArray(value.data)
      }, () => console.log(this.state.treeData));

    });
  }

  render () {
    // let addPage: Page = {
    //   name: '',
    // };
    return <>
      <AppBar position="sticky" variant={'outlined'} color={'default'}>
        <Toolbar>
           <IconButton
             edge="start"
             color="inherit"
             aria-label="Add"
             // onClick={() => this.openAddDialog()}
           >
            <AddOutlinedIcon/>
          </IconButton>
           <Divider/>
          <FormControl>
            <Select value={this.state.currentChannelId}>
             {this.state.channels.map(channel => {
               return <MenuItem disabled={channel.branch === null} key={channel.id} value={channel.id} onClick={() => this.updateSiteMapByChannel(channel.id)}>{channel.id} {channel.branch !== null && 'branch of ' + channel.branchOf}</MenuItem>
             })}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Container>
        {isNotEmptyOrNull(this.state.treeData) &&
        <SortableTree style={{minHeight: '70px', width: '100%'}}
                      reactVirtualizedListProps={{autoHeight: true}}
                      isVirtualized={false}
                      treeData={this.state.treeData}
                      getNodeKey={getNodeKey}
                      onChange={treeData => {
                        this.setState({treeData: treeData}, () => {
                          console.log('treedata updated', treeData)
                        });
                      }}
                      canNodeHaveChildren={node => (node.siteMapItem.name !== 'root' && !node.siteMapItem.name.includes('_any_'))}
          // @ts-ignore
                      nodeContentRenderer={SiteMapItemNodeRendererDefault}
                      generateNodeProps={rowInfo => ({
                        buttons: [
                          // this.getMenu(rowInfo)
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
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => this.setState({drawerOpen: false})}>
               <ChevronRightIcon/>
              </IconButton>
              <Typography variant="h6">
                SiteMap Item Editor
              </Typography>
            </Toolbar>
          </AppBar>
          <Container>
            <Form onChange={({formData}) => this.onSiteMapItemChanged(formData, this.state.selectedNode)} schema={siteMapItemSchema as JSONSchema7} formData={this.state.selectedNode.siteMapItem}>
              <></>
            </Form>
          </Container></>
          }
        </Drawer>
    </>
  }

  onSiteMapChanged () {
    const siteMap: SitemapItem[] = nodeToSiteMapItems(this.state.treeData);
    console.log('fullSitemap', siteMap);

  }

  onNodeSelected (node: TreeItem) {
    this.setState({drawerOpen: true, selectedNode: node})
  }

  onSiteMapItemChanged (siteMapItem: SitemapItem, node?: TreeItem) {
    if (node !== undefined) {
      node.siteMapItem = siteMapItem;
      node.title = `/${replaceWildCards(siteMapItem.name)}`;
      node.subtitle = hasWildCardOrReserved(siteMapItem.name) && `/${siteMapItem.name}`;
      this.setState({treeData: this.state.treeData},
        () => this.onSiteMapChanged());
    }
  }

}

export default SiteMap;
