import React from 'react';
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {channelOperationsApi} from "../ApiContext";
import {ChannelOperationsApi} from "../api/apis/channel-operations-api";
import {Channel} from "../api/models";
import {Nullable} from "../api/models/nullable";

type ChannelSwitcherState = {
  channels: Array<Channel>
  currentChannelId: Nullable<string>,
}
type ChannelSwitcherProps = {
  onChannelChanged: (channelId: string) => void
}

class ChannelSwitcher extends React.Component<ChannelSwitcherProps, ChannelSwitcherState> {

  constructor (props: ChannelSwitcherProps) {
    super(props);

    this.state = {
      channels: [],
      currentChannelId: null,
    };
  }

  componentDidMount (): void {
    this.updateChannels();
  }

  updateChannels () {
    const api: ChannelOperationsApi = channelOperationsApi;
    api.getChannels().then(value => {
      const channels: Array<Channel> = value.data;
      const currentChannel = channels.find(channel => channel.branch !== null);
      this.setState({
        channels: channels,
        currentChannelId: currentChannel?.id
      }, () => currentChannel && this.props.onChannelChanged(currentChannel?.id))
    });
  }

  render () {
    return (
      <FormControl style={{marginRight: '10px'}}>
        {this.state.currentChannelId &&
        <Select value={this.state.currentChannelId}
                onChange={(event) => this.setState({currentChannelId: event.target.value as string},
                  () => this.props.onChannelChanged(event.target.value as string))}>
          {this.state.channels.map(channel => {
            return <MenuItem
              disabled={channel.branch === null}
              key={channel.id}
              value={channel.id}
            >
              {channel.id}
            </MenuItem>
          })}
        </Select>
        }
      </FormControl>)
  }
}

export default ChannelSwitcher;
