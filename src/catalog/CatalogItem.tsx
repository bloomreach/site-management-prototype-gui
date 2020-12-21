import React from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Toolbar,
  Typography
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import AddOutlinedIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {JSONSchema7} from "json-schema";
import Form from "@rjsf/material-ui";
import {componentDefinitionSchema, simpleStringParameterTemplate} from "./catalog-utils";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';
import {ComponentDefinition, ParameterType} from "../api/models";
import TextFieldsIcon from '@material-ui/icons/TextFields';
import {Nullable} from "../api/models/nullable";
import {isNotEmptyOrNull} from "../common/common-utils";
import MenuIcon from "@material-ui/icons/Menu";

type CatalogItemState = {
  componentDefinition: ComponentDefinition
  parameters: Array<ParameterType>
  drawerOpen: boolean
}
type CatalogItemProps = {
  componentDefinition: ComponentDefinition
}

class CatalogItem extends React.Component<CatalogItemProps, CatalogItemState> {

  constructor (props: CatalogItemProps) {
    super(props);

    this.state = {
      componentDefinition: {...this.props.componentDefinition, parameters: []},
      drawerOpen: false,
      parameters: this.props.componentDefinition.parameters
    }

  }

  componentDidMount (): void {
  }

  onCatalogItemChanged () {
  }

  render () {
    const name: string = this.state.componentDefinition.label ? this.state.componentDefinition.label : this.state.componentDefinition.id;

    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}>
          <Avatar variant={"square"} alt={this.state.componentDefinition.label} src={this.state.componentDefinition.icon}>{name}</Avatar>
          <Typography style={{paddingLeft: '10px', paddingTop: '7px'}}> {name}</Typography>
        </AccordionSummary>
        <AccordionActions>
          <Grid item sm={4}>
            <IconButton
              disabled={false}
              edge="start"
              style={{left: 0}}
              color="inherit"
              aria-label="Delete"
              // onClick={() => this.deletePage()}
            >
              <DeleteOutlinedIcon/>
            </IconButton>
            <IconButton
              disabled={false}
              edge="start"
              style={{left: 0}}
              color="inherit"
              aria-label="Delete"
              // onClick={() => this.deletePage()}
            >
              <SettingsOutlinedIcon/>
            </IconButton>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Save"
              // onClick={() => this.savePage()}
            >
              <SaveOutlinedIcon/>
            </IconButton></Grid>
          <Grid item sm={8}>
            <IconButton
              disabled={false}
              edge="start"
              style={{left: 24}}
              color="inherit"
              aria-label="Add FieldGroup"
              // onClick={() => this.deletePage()}
            >
              <PostAddOutlinedIcon/>
            </IconButton>
            <IconButton
              disabled={false}
              edge="start"
              style={{left: 24}}
              color="inherit"
              aria-label="add Parameter"
              // onClick={() => this.deletePage()}
            >
              <AddOutlinedIcon/>
            </IconButton>

            <IconButton
              disabled={false}
              edge="start"
              style={{left: 24}}
              color="inherit"
              aria-label="add String Field"
              onClick={() => this.addParameter("string")}
            >
              <Badge anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
                     badgeContent={'+'}
                     color="primary">
                <TextFieldsIcon/>
                {/*<Icon className="fa fa-columns"/>*/}
              </Badge>
            </IconButton>

          </Grid>
        </AccordionActions>

        <AccordionDetails>
          <Grid item sm={4}>
            <Form
              schema={componentDefinitionSchema as JSONSchema7}
              formData={this.state.componentDefinition}><></>
            </Form>
          </Grid>
          <Grid item sm={8}>
            <Container>
              <Grid item sm={12}>
                {/*todo default */}
                <Box style={{
                  maxHeight: '250px',
                  overflow: 'auto',
                  marginBottom: '10px'
                }} bgcolor="info.main" color="primary.contrastText">
                  {isNotEmptyOrNull(this.state.parameters) &&
                  <List dense={true}>
                    {this.state.parameters.map((parameter: ParameterType) => {
                      return (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <MenuIcon/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={parameter.name}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="settings"
                              // onClick={() => this.deleteMenu(menu)}
                            >
                              <SettingsOutlinedIcon/>
                            </IconButton>
                            <IconButton edge="end" aria-label="delete"
                              // onClick={() => this.deleteMenu(menu)}
                            >
                              <DeleteOutlinedIcon/>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>)
                    })}
                  </List>
                  }
                </Box>
              </Grid>
              <Grid item sm={12}>
                <AppBar position={"sticky"} color="default">
                  <Toolbar variant={"dense"}>
                    <Typography>field group example 1</Typography>
                    <IconButton
                      disabled={false}
                      edge="end"
                      style={{left: 0}}
                      color="inherit"
                      aria-label="Settings"
                      // onClick={() => this.deletePage()}
                    >
                      <SettingsOutlinedIcon/>
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <Box style={{
                  height: '100px',
                  overflow: 'auto',
                  marginBottom: '10px'
                }} bgcolor="primary.main" color="primary.contrastText"/>
              </Grid>
            </Container>
          </Grid>
        </AccordionDetails>
      </Accordion>)
  }

  private addParameter (type: string) {
    let template: Nullable<ParameterType>;
    switch (type) {
      case 'string':
        template = simpleStringParameterTemplate;
        break;
      default:
        template = simpleStringParameterTemplate;
        break;
    }
    ;

    const parameters: Array<ParameterType> = this.state.parameters;
    parameters.push(template);
    this.setState({parameters: parameters});

  }
}

export default CatalogItem;
