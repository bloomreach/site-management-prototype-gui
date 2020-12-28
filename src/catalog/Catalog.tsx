import React from 'react';
import {Accordion, AccordionSummary, AppBar, Divider, IconButton, Toolbar, Typography} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import AddOutlinedIcon from "@material-ui/icons/Add";
import {Nullable} from "../api/models/nullable";
import ChannelSwitcher from "../common/ChannelSwitcher";
import {ChannelCatalogOperationsApi} from "../api/apis/channel-catalog-operations-api";
import {channelCatalogOperationsApi} from "../ApiContext";
import {CatalogGroup, ComponentDefinition} from "../api/models";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CatalogItem from "./CatalogItem";

type CatalogGroupComponents = {
  group: string
  components: Array<ComponentDefinition>
}

type CatalogState = {
  currentChannelId: Nullable<string>,
  catalogGroupComponents: Array<CatalogGroupComponents>
  dialogOpen: boolean
  drawerOpen: boolean
}
type CatalogProps = {}

class Catalog extends React.Component<CatalogProps, CatalogState> {

  constructor (props: CatalogProps) {
    super(props);

    this.state = {
      currentChannelId: null,
      catalogGroupComponents: [],
      drawerOpen: false,
      dialogOpen: false,
    }

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
    return <>
      <AppBar position="sticky" variant={'outlined'} color={'default'}>
        <Toolbar>
           <IconButton
             edge="start"
             color="inherit"
             aria-label="Add"
             // onClick={() => this.setState({dialogOpen: true})}
           >
            <AddOutlinedIcon/>
          </IconButton>
           <Divider/>
          <ChannelSwitcher onChannelChanged={channelId => this.onChannelChanged(channelId)}/>
        </Toolbar>
      </AppBar>
      {this.state.catalogGroupComponents.map((catalogGroupComponent, key) => {
        return (
          <Accordion key={this.state.currentChannelId + catalogGroupComponent.group} onChange={(event, expanded) => console.log('on change of accordion', expanded)}>

            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography><strong>Group: {catalogGroupComponent.group}</strong></Typography>
            </AccordionSummary>

            {catalogGroupComponent.components.map(componentDefinition => {
              return <CatalogItem
                deleteComponentDefinition={this.deleteComponentDefinition}
                saveComponentDefinition={this.saveComponentDefinition}
                key={this.state.currentChannelId + catalogGroupComponent.group + componentDefinition.id}
                componentDefinition={componentDefinition}>
              </CatalogItem>
            })}
          </Accordion>)
      })}
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

  private addCatalogGroup (catalogGroup: string, callback?: () => any) {

  }

  private deleteCatalogGroup (catalogGroup: string, callback?: () => any) {

  }

}

export default Catalog;
