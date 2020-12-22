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
  Card,
  CardHeader,
  Container,
  Drawer,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import AddOutlinedIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {JSONSchema7} from "json-schema";
import Form from "@rjsf/material-ui";
import {
  componentDefinitionSchema,
  getParameterIcon,
  getSchemaFromParameter,
  simpleStringParameterTemplate
} from "./catalog-utils";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';
import {ComponentDefinition, FieldGroup, ParameterType} from "../api/models";
import TextFieldsIcon from '@material-ui/icons/TextFields';
import {Nullable} from "../api/models/nullable";
import {isNotEmptyOrNull} from "../common/common-utils";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DropResult,
  ResponderProvided
} from "react-beautiful-dnd";

type CatalogItemState = {
  componentDefinition: ComponentDefinition
  parameters: Array<ParameterType>
  drawerOpen: boolean
  selectedParameter?: ParameterType
  fieldGroups: Array<FieldGroup>
}
type CatalogItemProps = {
  componentDefinition: ComponentDefinition
}

class CatalogItem extends React.Component<CatalogItemProps, CatalogItemState> {

  constructor (props: CatalogItemProps) {
    super(props);

    this.state = {
      componentDefinition: {...this.props.componentDefinition, parameters: [], fieldGroups: []},
      drawerOpen: false,
      parameters: this.props.componentDefinition.parameters || [],
      fieldGroups: this.props.componentDefinition.fieldGroups || []
    }

  }

  componentDidMount (): void {
  }

  deleteFieldGroupParameter (parameter: ParameterType) {
    const fieldGroups: Array<FieldGroup> = [];

    this.state.fieldGroups?.forEach(value => {
      const fieldGroup: FieldGroup = {...value, parameters: []};
      fieldGroup.parameters = value.parameters?.filter(value => value !== parameter.name)
      fieldGroups.push(fieldGroup);
    });

    this.setState({fieldGroups: fieldGroups});
    this.deleteParameter(parameter);
  }

  deleteParameter (parameter: ParameterType) {
    this.state.parameters &&
    this.setState((state) => {
      // @ts-ignore
      const parameters = state.parameters.filter(value => value.name !== parameter.name);
      return {
        parameters
      };
    });
  }

  onCatalogItemChanged () {
  }

  getActions () {
    return (<AccordionActions>
      <Grid item sm={4}>
        <IconButton
          disabled={false}
          edge="start"
          style={{left: 0}}
          color="inherit"
          aria-label="Delete"
          onClick={() => this.deleteComponentDefinition(this.state.componentDefinition)}
        >
          <DeleteOutlinedIcon/>
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Save"
          onClick={() => this.saveComponentDefinition(this.state.componentDefinition)}
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
    </AccordionActions>)
  }

  getCardHeader (parameter: ParameterType) {
    return <CardHeader style={{padding: '10px'}}
                       avatar={
                         <Avatar>
                           {getParameterIcon(parameter)}
                         </Avatar>
                       }
                       action={
                         <>
                                  <IconButton edge="end" aria-label="settings"
                                              onClick={() => this.setState({
                                                selectedParameter: parameter,
                                                drawerOpen: true
                                              })}>
                                        <SettingsOutlinedIcon/>
                                      </IconButton>
                                      <IconButton edge="end" aria-label="delete"
                                                  onClick={() => this.deleteFieldGroupParameter(parameter)}>
                                        <DeleteOutlinedIcon/>
                                      </IconButton>
                                  </>
                       }
                       title={parameter.name}
    />
  }

  render () {
    const name: string = this.state.componentDefinition.label ? this.state.componentDefinition.label : this.state.componentDefinition.id;
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}>
          <Avatar variant={"square"} alt={this.state.componentDefinition.label} src={this.state.componentDefinition.icon}>{name}</Avatar>
          <Typography style={{paddingLeft: '10px', paddingTop: '7px'}}>{name}</Typography>
        </AccordionSummary>
        {this.getActions()}
        <AccordionDetails>
          <Grid item sm={4}>
            <Form
              schema={componentDefinitionSchema as JSONSchema7}
              formData={this.state.componentDefinition}><></>
            </Form>
          </Grid>
          <Grid item sm={8}>
            <Container>

              <Box style={{
                maxHeight: '250px',
                overflow: 'auto',
                marginBottom: '10px'
              }}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided: DroppableProvided) => (
                      <div  {...provided.droppableProps}
                            ref={provided.innerRef}>
                        {// @ts-ignore
                          isNotEmptyOrNull(this.state.parameters) && this.state.parameters.map((parameter: ParameterType, index: number) => {
                            const isInFieldGroup: boolean = this.isInFieldGroup(parameter);
                            return !isInFieldGroup && (
                              <Draggable key={parameter.name} draggableId={parameter.name} index={index}>
                                {(provided) => (
                                  <Card variant={"outlined"} ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps} key={index}>
                                    {this.getCardHeader(parameter)}
                                  </Card>
                                )}
                              </Draggable>
                            )
                          })}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Box>

              {this.state.fieldGroups && this.state.fieldGroups.map((fieldGroup: FieldGroup) => {
                return (
                  <Box style={{
                    maxHeight: '200px',
                    overflow: 'auto',
                    marginBottom: '10px'
                  }}>
                    <AppBar position={"sticky"} style={{zIndex: 1}} color="default">
                      <Toolbar variant={"dense"}>
                        <Typography>{fieldGroup.name}</Typography>
                        <IconButton
                          disabled={false}
                          edge="end"
                          style={{left: 0}}
                          color="inherit"
                          aria-label="FieldGroup Settings"
                          // onClick={() => this.deletePage()}
                        >
                          <SettingsOutlinedIcon/>
                        </IconButton>
                        <IconButton
                          disabled={false}
                          edge="end"
                          style={{left: 0}}
                          color="inherit"
                          aria-label="Delete FieldGroup"
                          // onClick={() => this.deletePage()}
                        >
                          <DeleteOutlinedIcon/>
                        </IconButton>
                      </Toolbar>
                    </AppBar>
                    {fieldGroup.parameters?.map(fieldGroupParameterName => {
                      const fieldGroupParameter: ParameterType = this.getParameterFromFieldGroupParameterName(fieldGroupParameterName);
                      return (
                        <Card variant={"outlined"}>
                          {this.getCardHeader(fieldGroupParameter)}
                        </Card>
                      )
                    })}
                  </Box>
                )
              })}
            </Container>
            <Drawer anchor={'left'} open={this.state.drawerOpen}
                    onClose={() => this.setState({drawerOpen: false})}>
              {this.state.selectedParameter &&
              <>
          <AppBar position="static" color={"default"}>
            <Toolbar>
              <Typography variant="h6">
                Component - Parameter Editor
              </Typography>
               <IconButton edge="end" color="inherit" aria-label="menu"
                           onClick={() => this.setState({drawerOpen: false})}>
               <ChevronLeftIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Container>
            {this.state.selectedParameter &&
            <Form onChange={({formData}) => console.log(formData)} schema={getSchemaFromParameter(this.state.selectedParameter)} formData={this.state.selectedParameter}>
              <></>
            </Form>}
          </Container>
              </>
              }
            </Drawer>
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
      //todo more
      default:
        template = simpleStringParameterTemplate;
        break;
    }

    const parameters: Array<ParameterType> = this.state.parameters || [];
    parameters.push(template);
    this.setState({parameters: parameters});

  }

  private getParameterFromFieldGroupParameterName (fieldGroupParameterName: string): ParameterType {
    // @ts-ignore
    return this.state.parameters.find(element => element.name === fieldGroupParameterName);
  }

  private deleteComponentDefinition (componentDefinition: ComponentDefinition) {

  }

  private saveComponentDefinition (componentDefinition: ComponentDefinition) {

  }

  private isInFieldGroup (parameter: ParameterType): boolean {
    let isInFieldGroup: boolean = false;
    this.state.fieldGroups?.forEach(value => {
      let found = value.parameters?.find(element => element === parameter.name);
      if (found) {
        isInFieldGroup = true;
      }
    });
    return isInFieldGroup;
  }

  private onDragEnd (result: DropResult, provided: ResponderProvided) {
    console.log('result', result);
  }
}

export default CatalogItem;
