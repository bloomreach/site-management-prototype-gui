import React, {Fragment} from 'react';
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import Channels from "./Channels";
import Pages from "./Pages";
import {Badge, Typography} from "@material-ui/core";

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
      endpoint: 'https://fhpor9tqp6.execute-api.eu-central-1.amazonaws.com/production'
    }
  }

  onTabChange (nextTab: number) {
    this.setState({tab: nextTab});
  }

  render () {
    const {tab} = this.state || 0;

    return (
      // <EndpointProvider value={this.state.endpoint}>
      <Fragment>
        <AppBar position="static" color={'default'}>
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
                badgeContent={'U/C'} color="primary">
              </Badge>
            }/>
            <Tab label="Pages" icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                badgeContent={'U/C'} color="primary">
              </Badge>
            }/>
            <Tab label="Sitemap" disabled icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                badgeContent={'U/C'} color="primary">
              </Badge>
            }/>
            <Tab label="Sitemap" disabled icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                badgeContent={'U/C'} color="primary">
              </Badge>
            }/>
            <Tab label="Catalog" disabled icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                badgeContent={'U/C'} color="primary">
              </Badge>
            }/>
            <Tab label="Menus" disabled icon={
              <Badge
                style={{
                  right: '30px',
                  position: 'absolute',
                  top: '15px'
                }}
                badgeContent={'U/C'} color="primary">
              </Badge>
            }/>
          </Tabs>
          {/*</Toolbar>*/}
        </AppBar>

        <TabPanel value={tab} index={0}>
          <Channels endpoint={this.state.endpoint}/>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Pages endpoint={this.state.endpoint}/>
        </TabPanel>

        <AppBar style={{bottom: 0, top: "auto"}}>
          <Typography>endpoint: {this.state.endpoint}</Typography>
        </AppBar>
      </Fragment>)
    // </EndpointProvider>
  }

}

export default Navigation;
