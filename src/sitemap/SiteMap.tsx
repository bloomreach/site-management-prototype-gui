import React from 'react';
import {
  AppBar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Icon,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Typography
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import {Channel, SitemapItem} from "../api/models";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {ChannelOperationsApi} from "../api/apis/channel-operations-api";
import {channelOperationsApi, channelSiteMapOperationsApi} from "../ApiContext";
import {Nullable} from "../api/models/nullable";
import {ChannelSitemapOperationsApi} from "../api/apis/channel-sitemap-operations-api";
import SortableTree, {addNodeUnderParent, ExtendedNodeData, removeNode, TreeItem} from "react-sortable-tree";
import {
  convertSiteMapToTreeData,
  hasWildCardOrReserved,
  nodeToSiteMapItems,
  replaceWildCards,
  siteMapItemToTreeItem
} from "./sitemap-utils";
import {getNodeKey, isNotEmptyOrNull} from "../common/common-utils";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import SiteMapItemNodeRendererDefault from "./SiteMapItemNodeRendererDefault";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import {Delete} from "@material-ui/icons";

type SiteMapState = {
  channels: Array<Channel>
  currentChannelId: Nullable<string>,
  // currentSiteMap: Array<SitemapItem>
  dialogOpen: boolean
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
      type: ["string", 'null']
    },
    page: {
      type: ["string", 'null']
    },
    relativeContentPath: {
      type: ["string", 'null']
    },
    parameters: {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
};

const uiSchema = {
  name: {
    "ui:autofocus": true
  }
};

class SiteMap extends React.Component<SiteMapProps, SiteMapState> {

  constructor (props: SiteMapProps) {
    super(props);

    this.state = {
      channels: [],
      currentChannelId: null,
      treeData: [],
      drawerOpen: false,
      selectedNode: undefined,
      dialogOpen: false
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
        treeData: convertSiteMapToTreeData(value.data)
      }, () => console.log(this.state.treeData));
    });
  }

  getMenu (rowInfo: ExtendedNodeData) {
    const siteMapItem: SitemapItem = rowInfo.node.siteMapItem;
    const isNotLeaf = isNotEmptyOrNull(rowInfo.node.children);
    return <PopupState variant="popover" popupId="component-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <MoreHorizOutlinedIcon {...bindTrigger(popupState)}/>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={() => this.addSiteMapItem(rowInfo, "new-sitemap-item", () => popupState.close())}>
              <ListItemIcon>
                <Icon className="fa fa-sitemap" fontSize={'small'}/>
              </ListItemIcon>
              <Typography variant="inherit">Add Custom Matcher</Typography>
            </MenuItem>
            <MenuItem onClick={() => this.addSiteMapItem(rowInfo, "_index_", () => popupState.close())}>
              <ListItemIcon>
                <Icon className="fa fa-sitemap" fontSize={'small'}/>
              </ListItemIcon>
              <Typography variant="inherit">Add ./ Matcher (_index_)</Typography>
            </MenuItem>
            <MenuItem onClick={() => this.addSiteMapItem(rowInfo, "_any_", () => popupState.close())}>
              <ListItemIcon>
                <Icon className="fa fa-sitemap" fontSize={'small'}/>
              </ListItemIcon>
              <Typography variant="inherit">Add ** Matcher (_any_)</Typography>
            </MenuItem>
            <MenuItem onClick={() => this.addSiteMapItem(rowInfo, "_default_", () => popupState.close())}>
              <ListItemIcon>
                <Icon className="fa fa-sitemap" fontSize={'small'}/>
              </ListItemIcon>
              <Typography variant="inherit">Add * Matcher (_default_)</Typography>
            </MenuItem>
            <MenuItem disabled={siteMapItem.name === 'root'} onClick={() => this.deleteSiteMapItem(rowInfo, () => popupState.close())}>
              <ListItemIcon>
                <Delete fontSize="small"/>
              </ListItemIcon>
              <Typography variant="inherit">Delete Sitemap Item</Typography>
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  }

  render () {
    let addSiteMapItem: SitemapItem = {
      name: '',
    };
    return <>
      <AppBar position="sticky" variant={'outlined'} color={'default'}>
        <Toolbar>
           <IconButton
             edge="start"
             color="inherit"
             aria-label="Add"
             onClick={() => this.setState({dialogOpen: true})}
           >
            <AddOutlinedIcon/>
          </IconButton>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Save"
            onClick={() => this.saveSiteMap()}
          >
          <SaveOutlinedIcon/>
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
      <Dialog open={this.state.dialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle>Add Site Map Item</DialogTitle>
        <DialogContent>
          <Form onChange={({formData}) => addSiteMapItem = formData} formData={addSiteMapItem} uiSchema={uiSchema} schema={siteMapItemSchema as JSONSchema7}>
           <></>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.addSiteMapItem(null, addSiteMapItem.name, () => this.setState({dialogOpen: false}, () => this.updateSiteMap()))}>Add</Button>
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
                      canNodeHaveChildren={node => (node.siteMapItem.name !== 'root' && !node.siteMapItem.name.includes('_any_'))}
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
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => this.setState({drawerOpen: false})}>
               <ChevronRightIcon/>
              </IconButton>
              <Typography variant="h6">
                SiteMap Item Editor
              </Typography>
            </Toolbar>
          </AppBar>
          <Container>
            <Form onChange={({formData}) => this.onSiteMapItemChanged(formData, this.state.selectedNode)} schema={siteMapItemSchema as JSONSchema7} uiSchema={uiSchema} formData={this.state.selectedNode.siteMapItem}>
              <></>
            </Form>
          </Container></>
          }
        </Drawer>
    </>
  }

  saveSiteMap () {
    const siteMap: SitemapItem[] = nodeToSiteMapItems(this.state.treeData);
    const api: ChannelSitemapOperationsApi = channelSiteMapOperationsApi;

    this.state.currentChannelId &&

    siteMap.forEach(siteMapItem => {
      // @ts-ignore
      api.getChannelSitemapItem(this.state.currentChannelId, siteMapItem.name).then(value => {
        // @ts-ignore
        api.putChannelSitemapItem(this.state.currentChannelId, siteMapItem.name, siteMapItem, value.headers['x-resource-version']);
      }).catch(reason => {
        // @ts-ignore
        api.putChannelSitemapItem(this.state.currentChannelId, siteMapItem.name, siteMapItem);
      });
    });

    this.updateSiteMap();
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

  private addSiteMapItem (rowInfo: Nullable<ExtendedNodeData>, name: string, callback: () => any) {
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

  private deleteSiteMapItem (rowInfo: ExtendedNodeData, callback: () => any) {
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
          const api: ChannelSitemapOperationsApi = channelSiteMapOperationsApi;
          const siteMapItem = rowInfo.node.siteMapItem;
          // @ts-ignore
          api.deleteChannelSitemapItem(this.state.currentChannelId, siteMapItem.name).then(() => {
            this.onSiteMapChanged();
          })
        }
      }
    });
  }
}

export default SiteMap;
