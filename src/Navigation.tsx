import React, {Fragment} from 'react';
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import Channels from "./Channels";
import Pages from "./Pages";
import {Badge, Typography} from "@material-ui/core";
import SiteMap from "./SiteMap";
import Menus from "./menu/Menus";

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
      endpoint: 'http://localhost:8080/management/site/v1'
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
          {/*<Toolbar>*/}
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={tab} onChange={(event, nextTab) => this.onTabChange(nextTab)}>
            <Tab label="Channels" icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                color="primary">
              </Badge>
            }/>
            <Tab label="Pages" icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                 color="primary">
              </Badge>
            }/>
            <Tab label="Catalog" disabled icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                 color="primary">
              </Badge>
            }/>
            <Tab label="Sitemap"  icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                color="primary">
              </Badge>
            }/>

            <Tab label="Menus" icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                 color="primary">
              </Badge>
            }/>
          </Tabs>
          {/*</Toolbar>*/}
        </AppBar>

        <TabPanel value={tab} index={0}>
          <Channels endpoint={this.state.endpoint}/>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Pages/>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Typography>Catalog comes here</Typography>
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
