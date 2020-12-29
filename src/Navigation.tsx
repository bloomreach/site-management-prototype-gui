import React, {Fragment} from 'react';
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import Channels from "./channels/Channels";
import Pages from "./pages/Pages";
import {Typography} from "@material-ui/core";
import SiteMap from "./sitemap/SiteMap";
import Menus from "./menu/Menus";
import {endpoint} from "./ApiContext";
import Catalog from "./catalog/Catalog";

type NavigationState = {
  tab: number,
  endpoint: string
}
type NavigationProps = {}

class Navigation extends React.Component<NavigationProps, NavigationState> {

  constructor (props: NavigationProps) {
    super(props);
    this.state = {
      tab: 0,
      endpoint: endpoint
    }
  }

  onTabChange (nextTab: number) {
    this.setState({tab: nextTab});
  }

  render () {
    const {tab} = this.state || 0;

    return (
      <Fragment>
        <AppBar position="sticky" color={'default'}>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={tab} onChange={(event, nextTab) => this.onTabChange(nextTab)}>
            <Tab label="Channels"/>
            <Tab label="Pages"/>
            <Tab label="Catalog"/>
            <Tab label="Sitemap"/>
            <Tab label="Menus"/>
          </Tabs>
        </AppBar>
        <TabPanel value={tab} index={0}>
          <Channels/>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Pages/>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Catalog/>
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <SiteMap/>
        </TabPanel>
        <TabPanel value={tab} index={4}>
          <Menus/>
        </TabPanel>
        <AppBar style={{bottom: 0, top: "auto"}}>
          <Typography>endpoint: {this.state.endpoint}</Typography>
        </AppBar>
      </Fragment>)
  }

}

export default Navigation;
