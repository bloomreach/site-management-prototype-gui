import React from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  Toolbar
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import AddOutlinedIcon from "@material-ui/icons/Add";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import {ChannelSiteMenuOperationsApi} from "../api/apis/channel-site-menu-operations-api";
import {channelOperationsApi, channelSiteMenuOperationsApi} from "../ApiContext";
import {isNotEmptyOrNull} from "../util";
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import {ChannelOperationsApi} from "../api/apis/channel-operations-api";
import {Channel} from "../api/models";
import {Nullable} from "../api/models/nullable";

type MenusState = {
  channels: Array<Channel>
  currentChannelId: Nullable<string>,
  dialogOpen: boolean
  drawerOpen: boolean
  menus: Array<string>
}
type MenusProps = {
  // endpoint: string
}

const menuSchema = {
  type: "string",
};

const uiSchema = {
  "ui:autofocus": true
};

class Menus extends React.Component<MenusProps, MenusState> {

  constructor (props: MenusProps) {
    super(props);

    this.state = {
      channels: [],
      currentChannelId: null,
      drawerOpen: false,
      dialogOpen: false,
      menus: []
    }
  }

  componentDidMount (): void {
    this.updateMenus();
  }

  updateMenus () {
    if (this.state.currentChannelId === null) {
      const api: ChannelOperationsApi = channelOperationsApi;
      api.getChannels().then(value => {
        this.setState({channels: value.data},
          () => this.updateMenuByChannel(this.state.channels[0].id))
      });
    } else {
      this.state.currentChannelId && this.updateMenuByChannel(this.state.currentChannelId)
    }
  }

  updateMenuByChannel (channelId: string) {
    const api: ChannelSiteMenuOperationsApi = channelSiteMenuOperationsApi;
    api.getChannelSitemenus(channelId).then(value => {
      this.setState({
        currentChannelId: channelId,
        menus: value.data
      }, () => console.log(value.data));
    });
  }

  render () {
    let addMenu: string = '';
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

           <Divider/>
          <FormControl>
            <Select value={this.state.currentChannelId}>
             {this.state.channels.map(channel => {
               return <MenuItem disabled={channel.branch === null} key={channel.id} value={channel.id} onClick={() => this.updateMenuByChannel(channel.id)}>{channel.id} {channel.branch !== null && 'branch of ' + channel.branchOf}</MenuItem>
             })}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Dialog open={this.state.dialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle>Add Menu</DialogTitle>
        <DialogContent>
          <Form onChange={({formData}) => addMenu = formData} formData={addMenu} uiSchema={uiSchema} schema={menuSchema as JSONSchema7}>
           <></>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.addMenu(addMenu, () => this.setState({dialogOpen: false}, () => this.updateMenus()))}>Add</Button>
          <Button color="primary" onClick={() => this.setState({dialogOpen: false})}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <List dense={true}>
                  {isNotEmptyOrNull(this.state.menus) && this.state.menus.map(menu => {
                    return (<ListItem key={this.state.currentChannelId + menu}>
                        <ListItemAvatar>
                          <Avatar>
                            <MenuIcon/>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={menu}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => this.deleteMenu(menu)}>
                            <DeleteIcon/>
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  })}
            </List>
    </>
  }

  private addMenu (menu: string, callback?: () => any) {
    const api: ChannelSiteMenuOperationsApi = channelSiteMenuOperationsApi;
    // @ts-ignore
    api.putChannelSitemenu(this.state.currentChannelId, menu).then(() => {
      callback && callback();
      this.updateMenus();
    });
    // // @ts-ignore
    // api.getChannelSitemenu(this.state.currentChannelId, menu).then(value => {
    //   // @ts-ignore
    //   api.putChannelSitemenu(this.state.currentChannelId, menu, value.headers['x-resource-version']).then(() => {
    //     callback && callback();
    //     this.updateMenus();
    //   });
    // }).catch(reason => {
    //   // @ts-ignore
    //
    // });
  }

  private deleteMenu (menu: string, callback?: () => any) {
    const api: ChannelSiteMenuOperationsApi = channelSiteMenuOperationsApi;
    // @ts-ignore
    api.getChannelSitemenu(this.state.currentChannelId, menu).then(value => {
      // @ts-ignore
      api.deleteChannelSitemenu(this.state.currentChannelId, menu, value.headers['x-resource-version']).then(() => {
        this.updateMenus();
      });
    }).catch(reason => {
      // @ts-ignore
      //todo
    });
  }

}

export default Menus;
