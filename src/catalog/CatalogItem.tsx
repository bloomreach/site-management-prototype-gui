import React from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Avatar,
  Box,
  Card,
  CardHeader,
  Container,
  Drawer,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DropResult,
  ResponderProvided
} from "react-beautiful-dnd";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";

type CatalogItemState = {
  componentDefinition: ComponentDefinition
  parameters: Array<ParameterType>
  drawerOpen: boolean
  selectedParameter?: ParameterType
  fieldGroups: Array<FieldGroup>
  anchorEl: null | HTMLElement
  menuAnchorEl: Map<string, HTMLElement | null>
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
      fieldGroups: this.props.componentDefinition.fieldGroups || [],
      anchorEl: null,
      menuAnchorEl: new Map<string, HTMLElement | null>()
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

  getAddParameterMenu (id: string, fieldGroup?: FieldGroup) {
    return (<PopupState variant="popover" popupId={id}>
      {(popupState) => (
        <React.Fragment>
          <IconButton
            disabled={false}
            edge="start"
            style={{left: 24}}
            color="inherit"
            {...bindTrigger(popupState)}
            aria-label="add Parameter"
          >
            <AddOutlinedIcon/>
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={() => {
              this.addParameter("string", fieldGroup);
              popupState.close()
            }}>
              <ListItemIcon>
                <TextFieldsIcon fontSize="small"/>
              </ListItemIcon>
              <ListItemText primary="Add Simple String Parameter"/>
            </MenuItem>
            <MenuItem onClick={() => {
              this.addParameter("string", fieldGroup);
              popupState.close()
            }}>
              <ListItemIcon>
                <TextFieldsIcon fontSize="small"/>
              </ListItemIcon>
              <ListItemText primary="Add Content Path Parameter"/>
            </MenuItem>
            <MenuItem onClick={() => {
              this.addParameter("string", fieldGroup);
              popupState.close()
            }}>
              <ListItemIcon>
                <TextFieldsIcon fontSize="small"/>
              </ListItemIcon>
              <ListItemText primary="Add Drop Down Parameter"/>
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>)
  }

  getComponentDefinitionsActions () {
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

        {this.getAddParameterMenu('default')}

      </Grid>
    </AccordionActions>)
  }

  getParameterCardHeader (parameter: ParameterType, snapshot?: DraggableStateSnapshot) {
    return <CardHeader style={{padding: '10px'}}
                       isDragging={snapshot?.isDragging}
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

  getFieldGroupHeader (fieldGroup: FieldGroup, dragHandleProps?: DraggableProvidedDragHandleProps) {
    return <AppBar position={"sticky"} style={{zIndex: 1}} color="default">
      <Toolbar {...dragHandleProps} variant={"dense"}>
        <Typography>{fieldGroup.name}</Typography>
        <IconButton
          disabled={false}
          edge="end"
          style={{left: 0}}
          color="inherit"
          aria-label="Edit FieldGroup"
          // onClick={() => this.editFieldGroup(fieldGroup)}
        >
          <SettingsOutlinedIcon/>
        </IconButton>
        <IconButton
          disabled={false}
          edge="end"
          style={{left: 0}}
          color="inherit"
          aria-label="Delete FieldGroup"
          // onClick={() => this.deleteFieldGroup()}
        >
          <DeleteOutlinedIcon/>
        </IconButton>
        {this.getAddParameterMenu(fieldGroup.name, fieldGroup)}
      </Toolbar>
    </AppBar>
  }

  render () {
    const name: string = this.state.componentDefinition.label ? this.state.componentDefinition.label : this.state.componentDefinition.id;
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}>
          <Avatar variant={"square"} alt={name} src={this.state.componentDefinition.icon}>{name}</Avatar>
          <Typography style={{paddingLeft: '10px', paddingTop: '7px'}}>{name}</Typography>
        </AccordionSummary>
        {this.getComponentDefinitionsActions()}
        <AccordionDetails>
          <Grid item sm={4}>
            <Form
              schema={componentDefinitionSchema as JSONSchema7}
              formData={this.state.componentDefinition}><></>
            </Form>
          </Grid>
          <Grid item sm={8}>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="all-fieldGroups"
                         direction="vertical"
                         type="column">
                {(provided: DroppableProvided) => (
                  <Container {...provided.droppableProps}
                             ref={provided.innerRef}>

                    <Box>
                      <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="default" type={'parameter'}>

                          {(provided: DroppableProvided) => (
                            <div  {...provided.droppableProps}
                                  ref={provided.innerRef}>

                              {this.state.parameters.map((parameter: ParameterType, index: number) => {
                                const isInFieldGroup: boolean = this.isInFieldGroup(parameter);
                                return !isInFieldGroup && (
                                  <Draggable key={parameter.name} draggableId={parameter.name} index={index}>
                                    {(provided) => (
                                      <Card variant={"outlined"} ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps} key={index}>
                                        {this.getParameterCardHeader(parameter)}
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

                    {this.state.fieldGroups && this.state.fieldGroups.map((fieldGroup: FieldGroup, index: number) => {
                      // @ts-ignore
                      return (
                        <Draggable key={fieldGroup.name} draggableId={fieldGroup.name ? fieldGroup.name : index.toString()} index={index}>
                          {(provided) => (
                            <Box
                              // @ts-ignore
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              key={index}>

                              {this.getFieldGroupHeader(fieldGroup, provided.dragHandleProps)}

                              <DragDropContext onDragEnd={this.onDragEnd}>
                                <Droppable droppableId={fieldGroup.name ? fieldGroup.name : index.toString()} type={'parameter'}>

                                  {(provided: DroppableProvided) => (
                                    <div  {...provided.droppableProps}
                                          ref={provided.innerRef}>

                                      {fieldGroup.parameters?.map((fieldGroupParameterName, index) => {
                                        const fieldGroupParameter: ParameterType = this.getParameterFromFieldGroupParameterName(fieldGroupParameterName);

                                        return (
                                          <Draggable key={fieldGroupParameter.name} draggableId={fieldGroupParameter.name} index={index}>
                                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                              <Card variant={"outlined"} ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    key={index}>

                                                {this.getParameterCardHeader(fieldGroupParameter, snapshot)}

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
                          )}
                        </Draggable>
                      )
                    })}
                  </Container>
                )}
              </Droppable>
            </DragDropContext>
            <Drawer style={{maxWidth: '300px'}} anchor={'left'} open={this.state.drawerOpen}
                    onClose={() => this.setState({drawerOpen: false})}>
              {this.state.selectedParameter && <>
              <AppBar position="static" color={"default"}>
                <Toolbar>
                  <Typography style={{flexGrow: 1}} variant="h6">
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
              </>}
            </Drawer>
          </Grid>
        </AccordionDetails>
      </Accordion>)
  }

  private addParameter (type: string, fieldGroup?: FieldGroup) {
    let template: ParameterType;
    switch (type) {
      case 'string':
        template = {...simpleStringParameterTemplate};
        break;
      //todo more
      default:
        template = {...simpleStringParameterTemplate};
        break;
    }
    const originalTemplateName = template.name;
    const parameters: Array<ParameterType> = this.state.parameters || [];

    let i = 1;
    while (parameters.some(value => value.name === template.name)) {
      template.name = (originalTemplateName + i++);
    }
    parameters.push(template);

    const fieldGroups: Array<FieldGroup> = this.state.fieldGroups;
    if (fieldGroup) {
      const foundFieldGroup = fieldGroups.find(element => element.name === fieldGroup.name);
      foundFieldGroup?.parameters?.push(template.name);
    }
    this.setState({parameters: parameters, fieldGroups: fieldGroups});
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
