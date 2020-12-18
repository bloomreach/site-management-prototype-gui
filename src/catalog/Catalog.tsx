import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Divider,
  IconButton,
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
import {JSONSchema7} from "json-schema";
import Form from "@rjsf/material-ui";
import {componentDefinitionSchema} from "./catalog-utils";

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
      {this.state.catalogGroupComponents.map((value, key) => {
        return (
          <Accordion key={this.state.currentChannelId + value.group}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}>
              <Typography>Group: {value.group}</Typography>
            </AccordionSummary>
            {value.components.map(componentDefinition => {
              return <Accordion key={this.state.currentChannelId + value.group + componentDefinition.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}>
                  <Typography>Component: {componentDefinition.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/*<pre>{JSON.stringify(componentDefinition, undefined, 2)}</pre>*/}
                  <Form schema={componentDefinitionSchema as JSONSchema7}
                        formData={componentDefinition}><></>
                  </Form>
                </AccordionDetails>
              </Accordion>
            })}
          </Accordion>)
      })}
    </>
  }

  private addCatalogGroup (catalogGroup: string, callback?: () => any) {

  }

  private deleteCatalogGroup (catalogGroup: string, callback?: () => any) {

  }

}

export default Catalog;
