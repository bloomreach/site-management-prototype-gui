import React from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  Typography, withStyles
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import {Channel} from "./api/models";
import {exampleChannels} from "./samples/Example";
import Form from "@rjsf/material-ui";
import { JSONSchema7 } from "json-schema";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

type ChannelsState = {
  channels: Array<Channel>
}
type ChannelsProps = {
  classes: any
}

const schema = {
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
      ],"enumNames": [
        "Nederlands",
        "Engels",
        "Espanol",
      ],
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
      channels: exampleChannels
    }
  }

  componentDidMount (): void {
    // const api = new ChannelOperationsApi({
    //   baseOptions: {auth: {username: 'admin', password: 'admin'}, withCredentials: true,}
    // }, 'http://localhost:8080/management/site/v1')
    // api.getChannels().then(value => {
    //   this.setState({channels: value.data})
    // });
  }

  render () {
    const { classes } = this.props;
    return <>
      {this.state.channels.map((channel, index) => {
        return <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1c-content"
            id="panel1c-header">
            <Typography className={classes.heading}>id: {channel.id}</Typography>
            <Typography className={classes.secondaryHeading}>name: {channel.name}</Typography>

            <Typography></Typography>
            <Typography></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Form schema={schema as JSONSchema7}
                  formData={channel}  ><></></Form>
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
        </Accordion>
      })}
    </>
  }

}

export default withStyles(styles)(Channels);
