import React from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Divider,
  IconButton,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import {Channel} from "../api/models";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import AddOutlinedIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import {ChannelOperationsApi} from "../api/apis/channel-operations-api";
import {baseUrl, channelOperationsApi} from "../ApiContext";
import {channelSchema, channelUiSchema} from "./channel-utils";

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
    const api: ChannelOperationsApi = channelOperationsApi;
    api.getChannels().then(value => {
      let data: Array<Channel> = value.data;
      data.map(channel => {
        if (channel.responseHeaders === null) {
          channel.responseHeaders = {};
        }
        return channel;
      })
      this.setState({channels: data})
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
            aria-label="Add Channel"
            // disabled={true}
            onClick={() => window.open(`${baseUrl}/cms/experience-manager`, 'new')}>
            <AddOutlinedIcon/>
          </IconButton>
           <IconButton
             edge="start"
             color="inherit"
             aria-label="Branch Channel"
             // disabled={true}
             onClick={() => window.open(`${baseUrl}/cms/projects`, 'new')}>
             <Icon className="fas fa-code-branch"/>
          </IconButton>
        </Toolbar>
      </AppBar>
      {this.state.channels.map((channel, index) => {
        return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>id: {channel.id}</Typography>
              <Typography className={classes.secondaryHeading}>name: {channel.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Form onChange={({formData}) => channel = formData} uiSchema={channelUiSchema} schema={channelSchema as JSONSchema7}
                    formData={channel}><></>
              </Form>
            </AccordionDetails>
            <Divider/>
            <AccordionActions>
              <IconButton
                disabled={true}
                edge="start"
                color="inherit"
                aria-label="Delete Channel"
                // onClick={event => this.deleteComponent(item)}
              >
                <DeleteOutlinedIcon/>
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Save Channel"
                onClick={() => this.saveChannel(channel)}>
                <SaveOutlinedIcon/>
              </IconButton>
            </AccordionActions>
          </Accordion>)
      })}
    </>
  }

  private saveChannel (channel: Channel) {
    const api: ChannelOperationsApi = channelOperationsApi;
    api.getChannel(channel.id).then(response => {
      api.updateChannel(channel.id, channel, response.headers['x-resource-version'])
        .then(() => {
          this.updateChannels();
        })
    })

  }
}

export default withStyles(styles)(Channels);
