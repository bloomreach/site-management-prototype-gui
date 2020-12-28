import React from 'react';
import {FormControl, Link, MenuItem, Select} from "@material-ui/core";
import 'react-sortable-tree/style.css';
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
      this.setState({
        channels: channels,
        currentChannelId: channels[0].id
      }, () => this.props.onChannelChanged(channels[0].id))
    });
  }

  render () {
    // @ts-ignore
    return (
      <FormControl>
        {this.state.currentChannelId &&
        // @ts-ignore
        <Select value={this.state.currentChannelId} onChange={(event) => this.setState({currentChannelId: event.target.value}, () => this.props.onChannelChanged(event.target.value))}>
          {this.state.channels.map(channel => {
            return <MenuItem
              disabled={channel.branch === null}
              key={channel.id}
              value={channel.id}
              onSelect={event => console.log('on channel select')}
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
