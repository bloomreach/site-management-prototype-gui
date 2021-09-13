import React from 'react';
import {
  AccordionActions,
  AccordionDetails,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
import Form from "@rjsf/material-ui";
import {JSONSchema7} from "json-schema";
import {channelSchema, channelUiSchema} from "./channel-utils";
import {Channel, FieldGroup, ParameterType} from "../api/models";
import {baseUrl, channelOperationsApi} from "../ApiContext";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import {ChannelOperationsApi} from "../api/apis/channel-operations-api";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import AddOutlinedIcon from "@material-ui/icons/Add";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import LinkOutlinedIcon from "@material-ui/icons/LinkOutlined";
import ArrowDropDownCircleOutlinedIcon from "@material-ui/icons/ArrowDropDownCircleOutlined";
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import {
  contentPathParameterTemplate,
  dropDownParameterTemplate,
  fieldGroupSchema,
  fieldGroupUiSchema,
  getParameterIcon,
  getSchemaFromParameter,
  reorder,
  simpleStringParameterTemplate
} from "../catalog/catalog-utils";
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
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import {logError, logSuccess} from "../common/common-utils";
import {LogContext} from "../LogContext";
//todo a lot of copy paste from Catalog item, fix later
type ChannelEditorState = {
  channel: Channel

  parameters: Array<ParameterType>
  drawerOpen: boolean
  selectedParameter?: ParameterType
  fieldGroups: Array<FieldGroup>
  dialogOpen: boolean
  selectedFieldGroup?: FieldGroup
}
type ChannelEditorProps = {
  channel: Channel
}

class ChannelEditor extends React.Component<ChannelEditorProps, ChannelEditorState> {

  static contextType = LogContext;
  context!: React.ContextType<typeof LogContext>;

  constructor (props: ChannelEditorProps) {
    super(props);

    this.state = {
      channel: {...props.channel},
      drawerOpen: false,
      dialogOpen: false,
      fieldGroups: [],
      parameters: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount (): void {
    const api: ChannelOperationsApi = channelOperationsApi;
    api.getChannelParametersInfo(this.props.channel.id).then(response => this.setState({parameters: response.data})).catch(error => {
      logError(`error retrieving channel param info:  ${error?.response?.data}`, this.context); // error in the above string (in this case, yes)!
    });;
    api.getFieldGroups(this.props.channel.id).then(response => this.setState({fieldGroups: response.data})).catch(error => {
      logError(`error retrieving channel field groups  ${error?.response?.data}`, this.context); // error in the above string (in this case, yes)!
    });;
  }

  render () {
    const {channel} = this.state;
    let currentParameter = this.state.selectedParameter;
    return (
      <>
        {this.getActions(channel)}
        <AccordionDetails>
          <Grid item sm={6}>
            <Form onChange={({formData}) => this.setState({channel: formData})} uiSchema={channelUiSchema} schema={channelSchema as JSONSchema7}
                  formData={channel}><></>
            </Form>
          </Grid>
          <Grid item sm={6}>
            <IconButton
              disabled={false}
              edge="start"
              style={{left: 24}}
              color="inherit"
              aria-label="Add FieldGroup"
              onClick={() => this.setState({dialogOpen: true})}>
          <PostAddOutlinedIcon/>
        </IconButton>
            {this.getAddParameterMenu('default')}
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="all-fieldGroups"
                         direction="vertical"
                         type="column">
                {(provided: DroppableProvided) => (
                  <Container {...provided.droppableProps}
                             ref={provided.innerRef}>
                    <Box>
                      <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="default" type={'default_parameter'}>

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
                                <Droppable droppableId={fieldGroup.name ? fieldGroup.name : index.toString()} type={'fieldGroup_parameter'}>

                                  {(provided: DroppableProvided) => (
                                    <div  {...provided.droppableProps}
                                          ref={provided.innerRef}>

                                      {fieldGroup.parameters?.map((fieldGroupParameterName, index) => {
                                        const fieldGroupParameter: ParameterType | undefined = this.getParameterFromFieldGroupParameterName(fieldGroupParameterName);

                                        return fieldGroupParameter && (
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
                    onClose={() => this.onDrawerClose(currentParameter)}>
              {this.state.selectedParameter && <>
              <AppBar position="static" color={"default"}>
                <Toolbar>
                  <Typography style={{flexGrow: 1, textTransform: 'capitalize'}} variant="h6">
                    Component - Parameter Editor
                  </Typography>
                   <IconButton edge="end" color="inherit" aria-label="menu"
                               onClick={() => this.onDrawerClose(currentParameter)}>
                   <ChevronLeftIcon/>
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Container>
                {this.state.selectedParameter &&
                <Form onChange={(form) => {
                  currentParameter = form.formData
                }} schema={getSchemaFromParameter(this.state.selectedParameter)} formData={this.state.selectedParameter}>
                  <></>
                </Form>}
              </Container>
              </>}
            </Drawer>
            {this.getAddOrEditFieldGroupDialog()}
          </Grid>


        </AccordionDetails>
        <Divider/>
        {this.getActions(channel)}

      </>
    )
  }

  getAddOrEditFieldGroupDialog () {
    const edit = this.state.selectedFieldGroup && true;
    const currentFieldGroupName = this.state.selectedFieldGroup ? this.state.selectedFieldGroup.name : '';
    let nextFieldGroupName = currentFieldGroupName;
    return <Dialog open={this.state.dialogOpen}>
      <DialogTitle>Field Group Name</DialogTitle>
      <DialogContent>
        <Form onChange={({formData}) => nextFieldGroupName = formData} formData={currentFieldGroupName} uiSchema={fieldGroupUiSchema} schema={fieldGroupSchema as JSONSchema7}>
          <></>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => {
          if (!edit) {
            //add
            this.setState((state) => {
              const fieldGroups = state.fieldGroups.concat({name: nextFieldGroupName, parameters: []});
              return {
                fieldGroups,
                dialogOpen: false,
                selectedFieldGroup: undefined
              }
            })
          } else {
            this.setState((state) => {
              const fieldGroups = state.fieldGroups.map(function (item) {
                return currentFieldGroupName === item.name ? {...item, name: nextFieldGroupName} : item;
              });
              return {
                fieldGroups,
                dialogOpen: false,
                selectedFieldGroup: undefined
              }
            })
          }
        }}>OK</Button>
        <Button color="primary" onClick={() => this.setState({dialogOpen: false})}>Cancel</Button>
      </DialogActions>
    </Dialog>
  }

  getParameterCardHeader (parameter: ParameterType, snapshot?: DraggableStateSnapshot) {
    return (
      <CardHeader style={{padding: '10px'}}
                  isDragging={snapshot?.isDragging}
                  avatar={<Avatar>
                    {getParameterIcon(parameter)}
                  </Avatar>}
                  action={
                    <>
                      <IconButton edge="end" aria-label="settings" onClick={() => this.setState({
                        selectedParameter: parameter,
                        drawerOpen: true
                      })}>
                            <EditOutlinedIcon/>
                      </IconButton>
                       <IconButton edge="end" aria-label="delete" onClick={() => this.deleteFieldGroupParameter(parameter)}>
                            <DeleteOutlinedIcon/>
                       </IconButton>
                    </>
                  }
                  title={parameter.name}
      />)
  }

  deleteFieldGroupParameter (parameter: ParameterType) {
    const fieldGroups: Array<FieldGroup> = [];

    //todo can do this better?
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

    const api: ChannelOperationsApi = channelOperationsApi;
    api.deleteChannelParameterInfo(this.state.channel.id, parameter.name).then();
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
          onClick={() => this.setState({selectedFieldGroup: fieldGroup, dialogOpen: true})}>
          <EditOutlinedIcon/>
        </IconButton>
        <IconButton
          disabled={false}
          edge="end"
          style={{left: 0}}
          color="inherit"
          aria-label="Delete FieldGroup"
          onClick={() => {
            this.setState((state) => {
              const fieldGroups = state.fieldGroups.filter((element: FieldGroup) => element.name !== fieldGroup.name);
              return {
                fieldGroups
              };
            })
            const api: ChannelOperationsApi = channelOperationsApi;
            api.deleteFieldGroup(this.state.channel.id, fieldGroup.name).then();
          }}>
          <DeleteOutlinedIcon/>
        </IconButton>
        {this.getAddParameterMenu(fieldGroup.name, fieldGroup)}
      </Toolbar>
    </AppBar>
  }

  private getActions (channel: Channel) {
    return (<AccordionActions>
      <Grid item sm={12} style={{justifyContent: "flex-start"}}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Delete Channel"
          onClick={() => window.open(`${baseUrl}/cms/projects/${channel.id?.split(':')[1]}/channels`, 'new')}>
          <DeleteOutlinedIcon/>
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Save Channel"
          onClick={() => this.saveChannel(channel)}>
          <SaveOutlinedIcon/>
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Refresh Channel"
          onClick={() => this.updateChannel()}>
          <RefreshOutlinedIcon/>
        </IconButton>
      </Grid>
    </AccordionActions>)
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
            aria-label="add Parameter">
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
              <ListItemText primary="Add Simple Parameter"/>
            </MenuItem>
            <MenuItem onClick={() => {
              this.addParameter("contentpath", fieldGroup);
              popupState.close()
            }}>
              <ListItemIcon>
                <LinkOutlinedIcon fontSize="small"/>
              </ListItemIcon>
              <ListItemText primary="Add Content Path Parameter"/>
            </MenuItem>
            <MenuItem onClick={() => {
              this.addParameter("dropdown", fieldGroup);
              popupState.close()
            }}>
              <ListItemIcon>
                <ArrowDropDownCircleOutlinedIcon fontSize="small"/>
              </ListItemIcon>
              <ListItemText primary="Add Drop Down Parameter"/>
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>)
  }

  private getParameterFromFieldGroupParameterName (fieldGroupParameterName: string): ParameterType | undefined {
    return this.state.parameters.find(element => element.name === fieldGroupParameterName);
  }

  private addParameter (type: string, fieldGroup?: FieldGroup) {
    let template: ParameterType;
    switch (type) {
      case 'string':
        template = {...simpleStringParameterTemplate};
        break;
      case 'contentpath':
        template = {...contentPathParameterTemplate, name: 'document'};
        break;
      case 'dropdown':
        template = {...dropDownParameterTemplate, name: 'dropdown'};
        break;
      case 'imagesetpath':
        template = {...contentPathParameterTemplate, name: 'image'};
        break;
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

    const fieldGroups: Array<FieldGroup> | undefined = this.state.fieldGroups;
    if (fieldGroup) {
      // @ts-ignore
      const foundFieldGroup = fieldGroups.find(element => element.name === fieldGroup.name);
      foundFieldGroup?.parameters?.push(template.name);
    }
    this.setState({parameters: parameters, fieldGroups: fieldGroups});
  }

  private isInFieldGroup (parameter: ParameterType): boolean {
    let isInFieldGroup: boolean = false;
    this.state.fieldGroups?.forEach(value => {
      let found = value.parameters?.some(element => element === parameter.name);
      if (found) {
        isInFieldGroup = true;
      }
    });
    return isInFieldGroup;
  }

  private onDragEnd (result: DropResult, provided: ResponderProvided) {
    if (!result.destination) {
      return;
    }

    if (result.type === 'column') {
      // @ts-ignore
      const fieldGroups = reorder(
        this.state.fieldGroups,
        result.source.index,
        result.destination.index
      );

      this.setState({
        fieldGroups
      });

    }

    if (result.type === 'default_parameter') {
      // @ts-ignore
      const parameters = reorder(
        this.state.parameters,
        result.source.index,
        result.destination.index
      );

      this.setState({
        parameters
      });
    }

    if (result.type === 'fieldGroup_parameter') {
      let fieldGroupName = result.destination.droppableId;
      // @ts-ignore
      let fieldGroups = this.state.fieldGroups.map(fieldGroup => {
        if (fieldGroupName === fieldGroup.name) {
          // @ts-ignore
          const parameters = reorder(fieldGroup.parameters,
            result.source.index,
            // @ts-ignore
            result.destination.index);
          fieldGroup.parameters = parameters;
        }
        return fieldGroup;
      });

      this.setState({
        fieldGroups
      });
    }

  }

  private onDrawerClose (currentParameter?: ParameterType,) {
    if (currentParameter && this.state.selectedParameter) {
      const selectedParameter = this.state.selectedParameter;
      this.setState((state) => {
        const parameters = state.parameters.map(function (item) {
          return selectedParameter.name === item.name ? {...currentParameter} : item;
        });
        const fieldGroups = state.fieldGroups.map(function (fieldGroup) {
          if (fieldGroup.parameters) {
            fieldGroup.parameters = fieldGroup.parameters?.map(function (parameter) {
              return parameter === selectedParameter.name ? currentParameter.name : parameter;
            })
          }
          return fieldGroup;
        });
        return {
          parameters: parameters,
          fieldGroups: fieldGroups,
          drawerOpen: false
        }
      });

      //updating by removing and adding...
      const api: ChannelOperationsApi = channelOperationsApi;
      api.deleteChannelParameterInfo(this.state.channel.id, selectedParameter.name).then();
      api.putChannelParameterInfo(this.state.channel.id, currentParameter.name, currentParameter).then();
    }
  }

  private saveChannel (channel: Channel) {
    const api: ChannelOperationsApi = channelOperationsApi;

    this.state.fieldGroups.forEach(fieldGroup => {
      api.getFieldGroup(channel.id, fieldGroup.name).then(response => {
        api.putFieldGroup(channel.id, fieldGroup.name, fieldGroup, response.headers['x-resource-version']).then();
      }).catch(() => {
        api.putFieldGroup(channel.id, fieldGroup.name, fieldGroup).then();
      })
    });

    this.state.parameters.forEach((parameter, index, arr) => {
      api.getChannelParameterInfo(channel.id, parameter.name).then(response => {
        api.putChannelParameterInfo(channel.id, parameter.name, parameter, response.headers['x-resource-version']).then();
      }).catch(() => {
        api.putChannelParameterInfo(channel.id, parameter.name, parameter).then();
      });
    });

    api.getChannel(channel.id).then(response => {
      api.updateChannel(channel.id, channel, response.headers['x-resource-version'])
        .then(() => {
          this.updateChannel();
        })
    });

  }

  updateChannel () {
    const api: ChannelOperationsApi = channelOperationsApi;
    api.getChannel(this.state.channel.id).then(value => {
      let channel: Channel = value.data;
      if (channel.responseHeaders === null) {
        channel.responseHeaders = {};
      }
      this.setState({channel: channel});
      logSuccess('updated channel ' + channel.id, this.context);
    }).catch(reason => logError("error trying to get the channels, reason:", reason?.data));
  }

}

export default ChannelEditor;
