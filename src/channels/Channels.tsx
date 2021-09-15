import React from 'react';
import {Accordion, AccordionSummary, AppBar, Button, Toolbar, Typography, withStyles} from "@material-ui/core";
import {Channel} from "../api/models";
import AddOutlinedIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import {ChannelOperationsApi} from "../api/apis/channel-operations-api";
import {getBaseUrl, getChannelOperationsApi} from "../ApiContext";
import {LogContext} from "../LogContext";
import {logError, logSuccess} from "../common/common-utils";
import ChannelEditor from "./ChannelEditor";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

type ChannelsState = {
  channels: Array<Channel>,
  dialogOpen: boolean
}
type ChannelsProps = {
  classes: any,
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

class Channels extends React.Component<ChannelsProps, ChannelsState> {

  static contextType = LogContext;
  context!: React.ContextType<typeof LogContext>;

  constructor (props: ChannelsProps) {
    super(props);

    this.state = {
      channels: [],
      dialogOpen: false
    }
  }

  componentDidMount (): void {
    this.updateChannels();
  }

  updateChannels () {
    const api: ChannelOperationsApi = getChannelOperationsApi();
    api.getChannels().then(value => {
      let data: Array<Channel> = value.data;
      data.map(channel => {
        if (channel.responseHeaders === null) {
          channel.responseHeaders = {};
        }
        return channel;
      });
      this.setState({channels: data});
      logSuccess('updated channels..', this.context);
    }).catch(reason => logError("error trying to get the channels, reason:", reason?.data));
  }

  render () {
    const {classes} = this.props;
    return <>
      <AppBar position="sticky" variant={'outlined'} color={'default'}>
        <Toolbar>
          <Button
            variant="outlined"
            color="primary"
            style={{marginRight: '10px'}}
            startIcon={<AddOutlinedIcon/>}
            onClick={() => window.open(`${getBaseUrl()}/cms/experience-manager`, 'new')}>
            Add Channel
          </Button>
          <Button
            variant="outlined"
            color="primary"
            style={{marginRight: '10px'}}
            startIcon={<Icon className="fas fa-code-branch"/>}
            onClick={() => window.open(`${getBaseUrl()}/cms/projects`, 'new')}>
            Branch Channel
          </Button>
        </Toolbar>
      </AppBar>
      {this.state.channels.map((channel, index) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>id: {channel.id}</Typography>
              <Typography className={classes.secondaryHeading}>name: {channel.name}</Typography>
            </AccordionSummary>
            <ChannelEditor channel={channel}/>
          </Accordion>
        )
      })}
    </>
  }

}

export default withStyles(styles)(Channels);
