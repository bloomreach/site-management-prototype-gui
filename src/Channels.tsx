import React from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";

type ChannelsState = {
  channels: Array<Channel>,
  dialogOpen: boolean
}
type ChannelsProps = {
  classes: any
}

const channelSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      "ui:disabled": true
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
      "enum": [
        "nl",
        "en",
        "es",
      ], "enumNames": [
        "Nederlands",
        "English",
        "Espanol",
      ]
    },
    // responseHeaders: {
    //   "type": "object",
    //   "additionalProperties": {
    //     "type": "string"
    //   }
    // },
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
    const api = new ChannelOperationsApi({
      // baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    }, 'https://fhpor9tqp6.execute-api.eu-central-1.amazonaws.com/production')
    api.getChannels().then(value => {
      console.log(value);
      this.setState({channels: value.data})
    });
  }

  closeAddDialog () {
    this.setState({dialogOpen: false})
  }

  openAddDialog () {
    this.setState({dialogOpen: true})
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
            onClick={event => this.openAddDialog()}>
            <AddOutlinedIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog open={this.state.dialogOpen} aria-labelledby="form-dialog-title">
        <DialogTitle>Add Channel</DialogTitle>
        <DialogContent>
          <Form schema={channelSchema as JSONSchema7}>
           <></>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button disabled color="primary">Save</Button>
          <Button color="primary" onClick={() => this.closeAddDialog()}>Cancel</Button>
        </DialogActions>
      </Dialog>
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
              <Form schema={channelSchema as JSONSchema7}
                    formData={channel}><></>
              </Form>
              <pre>{JSON.stringify(channel, undefined, 2)}</pre>
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
                disabled={true}
                // onClick={event => this.handleSave(item)}
              >
                <SaveOutlinedIcon/>
              </IconButton>
            </AccordionActions>
          </Accordion>)
      })}
    </>
  }

}

export default withStyles(styles)(Channels);
