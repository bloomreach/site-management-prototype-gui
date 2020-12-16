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
import {Channel} from "./api/models";
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {channelOperationsApi} from "./ApiContext";
import {localeEnum, localeValues} from "./samples/Locales";

type ChannelsState = {
  channels: Array<Channel>,
  dialogOpen: boolean
}
type ChannelsProps = {
  classes: any,
  endpoint: string
}

const channelUiSchema = {
  id: {
    "ui:disabled": true
  },
  name: {
    "ui:disabled": true
  },
  branch: {
    "ui:disabled": true
  },
  branchOf: {
    "ui:disabled": true
  },
  contentRootPath: {
    "ui:disabled": true
  }
}

const channelSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string"
    },
    branch: {
      type: "string"
    },
    branchOf: {
      type: "string"
    },
    contentRootPath: {
      type: "string"
    },
    locale: {
      type: "string",
      "enum": localeEnum,
      "enumNames": localeValues
    },
    devices: {
      type: "array",
      items: {
        type: "string"
      }
    },
    defaultDevice: {
      type: "string"
    },
    linkurlPrefix: {
      type: ["string", 'null']
    },
    cdnHost: {
      type: ["string", 'null']
    },
    responseHeaders: {
      "type": ["object", 'null'],
      "additionalProperties": {
        "type": "string"
      }
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
    const api = channelOperationsApi;
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
            onClick={event => window.open('http://localhost:8080/cms/experience-manager', 'new')}>
            <AddOutlinedIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      {this.state.channels.map((channel, index) => {
        return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
              aria-controls="panel1c-content"
              id="panel1c-header">
              <Typography className={classes.heading}>id: {channel.id}</Typography>
              <Typography className={classes.secondaryHeading}>name: {channel.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Form onChange={({formData}) => channel = formData} uiSchema={channelUiSchema} schema={channelSchema as JSONSchema7}
                    formData={channel}><></>
              </Form>
              {/*<pre>{JSON.stringify(channel, undefined, 2)}</pre>*/}
            </AccordionDetails>
            <Divider/>
            <AccordionActions>
              <IconButton
                disabled={true}
                edge="start"
                color="inherit"
                aria-label="Delete"
                // onClick={event => this.deleteComponent(item)}
              >
                <DeleteOutlinedIcon/>
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Save"
                // disabled={!item.changed}
                // disabled={true}
                onClick={() => this.saveChannel(channel)}
              >
                <SaveOutlinedIcon/>
              </IconButton>
            </AccordionActions>
          </Accordion>)
      })}
    </>
  }

  private saveChannel (channel: Channel) {
    const api = channelOperationsApi;
    api.getChannel(channel.id).then(response => {
      api.updateChannel(channel.id, channel, response.headers['x-resource-version'])
        .then(() => {
          this.updateChannels();
        })
    })

  }
}

export default withStyles(styles)(Channels);
