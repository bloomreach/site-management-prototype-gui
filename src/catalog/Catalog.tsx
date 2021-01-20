import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Toolbar,
  Typography
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import AddOutlinedIcon from "@material-ui/icons/Add";
import {Nullable} from "../api/models/nullable";
import ChannelSwitcher from "../common/ChannelSwitcher";
import {ChannelCatalogOperationsApi} from "../api/apis/channel-catalog-operations-api";
import {channelCatalogOperationsApi} from "../ApiContext";
import {CatalogGroup, ComponentDefinition} from "../api/models";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CatalogItem from "./CatalogItem";
import Form from "@rjsf/material-ui";
import {catalogGroupSchema, catalogGroupUiSchema, componentDefinitionSchema, slugify} from "./catalog-utils";
import {JSONSchema7} from "json-schema";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

type CatalogGroupComponents = {
  group: string
  components: Array<ComponentDefinition>
}

type CatalogState = {
  currentChannelId: Nullable<string>,
  catalogGroupComponents: Array<CatalogGroupComponents>
  addGroupDialogOpen: boolean
  addComponentDialogOpen: boolean
  drawerOpen: boolean
  selectedGroupName?: string
}
type CatalogProps = {}

class Catalog extends React.Component<CatalogProps, CatalogState> {

  constructor (props: CatalogProps) {
    super(props);

    this.state = {
      currentChannelId: null,
      catalogGroupComponents: [],
      drawerOpen: false,
      addGroupDialogOpen: false,
      addComponentDialogOpen: false,
    };

    this.onChannelChanged = this.onChannelChanged.bind(this);
    this.deleteComponentDefinition = this.deleteComponentDefinition.bind(this);
    this.saveComponentDefinition = this.saveComponentDefinition.bind(this);
  }

  componentDidMount (): void {
    this.updateCatalogs();
  }

  updateCatalogs () {
    if (this.state.currentChannelId !== null) {
      const catalogGroupComponents: Array<CatalogGroupComponents> = [];

      const api: ChannelCatalogOperationsApi = channelCatalogOperationsApi;
      // @ts-ignore
      api.getChannelCatalogGroups(this.state.currentChannelId).then(value => {
        const catalogGroups: Array<CatalogGroup> = value.data;
        catalogGroups.forEach(catalogGroup => {
          // @ts-ignore
          api.getChannelCatalogGroupComponents(this.state.currentChannelId, catalogGroup.name).then(response => {
            catalogGroupComponents.splice(0, 0, {group: catalogGroup.name, components: response.data});
          }).then(response => {
            this.setState({catalogGroupComponents: catalogGroupComponents});
          })
        });
      });
    }
  }

  onChannelChanged (channelId: string) {
    this.setState({currentChannelId: channelId}, () => this.updateCatalogs());
  }

  render () {
    let currentCatalogGroup: CatalogGroup;
    let currentComponentDefinition: ComponentDefinition;
    return <>
      <AppBar position="sticky" variant={'outlined'} color={'default'}>
        <Toolbar>
          <ChannelSwitcher onChannelChanged={channelId => this.onChannelChanged(channelId)}/>
           <Button
             variant="outlined"
             color="primary"
             style={{marginRight: '10px'}}
             startIcon={<AddOutlinedIcon/>}
             onClick={() => this.setState({addGroupDialogOpen: true})}>
            Add Group
          </Button>
        </Toolbar>
      </AppBar>
      {this.state.catalogGroupComponents.map((catalogGroupComponent: CatalogGroupComponents, key) => {
        return (
          <Accordion key={this.state.currentChannelId + catalogGroupComponent.group} onChange={(event, expanded) => console.log('on change of accordion', expanded)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Group: {catalogGroupComponent.group}</Typography>
            </AccordionSummary>
            <Toolbar>
              <Button
                variant="outlined"
                color="primary"
                style={{marginRight: '10px'}}
                startIcon={<AddOutlinedIcon/>}
                onClick={() => this.setState({
                  addComponentDialogOpen: true,
                  selectedGroupName: catalogGroupComponent.group
                })}>
                Add Component
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                style={{marginRight: '10px'}}
                startIcon={<DeleteOutlinedIcon/>}
                onClick={() => this.deleteCatalogGroup(catalogGroupComponent.group)}>
                Delete Group
              </Button>
            </Toolbar>
            {catalogGroupComponent.components.map(componentDefinition => {
              return (
                <CatalogItem
                  deleteComponentDefinition={this.deleteComponentDefinition}
                  saveComponentDefinition={this.saveComponentDefinition}
                  key={this.state.currentChannelId + catalogGroupComponent.group + componentDefinition.id}
                  componentDefinition={componentDefinition}>
                </CatalogItem>)
            })}
          </Accordion>)
      })}
      <Dialog open={this.state.addGroupDialogOpen}>
        <DialogTitle>Add Group</DialogTitle>
        <DialogContent>
          <Form onChange={({formData}) => currentCatalogGroup = formData} uiSchema={catalogGroupUiSchema} schema={catalogGroupSchema as JSONSchema7}>
            <></>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => {
            this.addCatalogGroup(currentCatalogGroup, () => this.setState({addGroupDialogOpen: false}));
          }}>OK</Button>
          <Button color="primary" onClick={() => this.setState({addGroupDialogOpen: false})}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={this.state.addComponentDialogOpen}>
        <DialogTitle>Add Component</DialogTitle>
        <DialogContent>
          <Form onChange={({formData}) => currentComponentDefinition = formData} uiSchema={componentDefinitionSchema} schema={componentDefinitionSchema as JSONSchema7}>
            <></>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => {
            this.addComponentDefinition(currentComponentDefinition, this.state.selectedGroupName, () => this.setState({addComponentDialogOpen: false}));
          }}>OK</Button>
          <Button color="primary" onClick={() => this.setState({addComponentDialogOpen: false})}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  }

  private deleteComponentDefinition (componentDefinition: ComponentDefinition) {
    const api: ChannelCatalogOperationsApi = channelCatalogOperationsApi;
    const group = componentDefinition.id.split('/')[0];
    const name = componentDefinition.id.split('/')[1];
    this.state.currentChannelId && api.deleteChannelCatalogGroupComponent(this.state.currentChannelId, group, name).then(value => {
      this.updateCatalogs();
    })
  }

  private saveComponentDefinition (componentDefinition: ComponentDefinition) {
    console.log('saving..', componentDefinition)
    const api: ChannelCatalogOperationsApi = channelCatalogOperationsApi;
    const group = componentDefinition.id.split('/')[0];
    const name = componentDefinition.id.split('/')[1];
    this.state.currentChannelId && api.getChannelCatalogGroupComponent(this.state.currentChannelId, group, name).then(response => {
      this.state.currentChannelId && api.putChannelCatalogGroupComponent(this.state.currentChannelId, group, name, componentDefinition, response.headers['x-resource-version']).then(response => {
        // this.updateCatalogs();
      })
    })

  }

  private addCatalogGroup (catalogGroup: CatalogGroup, callback?: () => any) {
    console.log('add catalog group', catalogGroup)
    const api: ChannelCatalogOperationsApi = channelCatalogOperationsApi;
    this.state.currentChannelId && api.putChannelCatalogGroup(this.state.currentChannelId, catalogGroup.name, catalogGroup).then(() => {
      this.updateCatalogs();
      callback && callback();
    });
  }

  private addComponentDefinition (componentDefinition: ComponentDefinition, group?: string, callback?: () => any) {
    const api: ChannelCatalogOperationsApi = channelCatalogOperationsApi;
    let componentName = slugify(componentDefinition.label);
    const component = {...componentDefinition, id: `${group}/${componentName}`}
    this.state.currentChannelId && group &&
    api.putChannelCatalogGroupComponent(this.state.currentChannelId,
      group,
      componentName,
      component).then(() => {
      this.updateCatalogs();
      callback && callback();
    });
  }

  private deleteCatalogGroup (catalogGroup: string) {
    const api: ChannelCatalogOperationsApi = channelCatalogOperationsApi;
    this.state.currentChannelId && catalogGroup &&
    api.deleteChannelCatalogGroup(this.state.currentChannelId,
      catalogGroup).then(() => {
      this.updateCatalogs();
    });
  }

}

export default Catalog;
