import React, {Fragment} from 'react';
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import Channels from "./channels/Channels";
import Pages from "./pages/Pages";
import {Snackbar, Typography} from "@material-ui/core";
import SiteMap from "./sitemap/SiteMap";
import Menus from "./menu/Menus";
import {endpoint} from "./ApiContext";
import Catalog from "./catalog/Catalog";
import GlobalProvider, {GlobalContext} from "./LogContext";
import Alert from '@material-ui/lab/Alert';

type NavigationState = {
  tab: number,
  endpoint: string
}
type NavigationProps = {}

class Navigation extends React.Component<NavigationProps, NavigationState> {

  constructor (props: NavigationProps) {
    super(props);

    console.log('env', process.env);
    console.log('dir', __dirname);

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
      <GlobalProvider>
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
          <GlobalContext.Consumer>
            {(props) => {
              return (
                <Snackbar
                  anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                  open={props.open}
                  autoHideDuration={props.timeOut}
                  onClose={props.onClose}>
                  <Alert severity={'success'}>
                    {props.message}
                  </Alert>
                </Snackbar>
              )
            }}
          </GlobalContext.Consumer>
          <AppBar style={{bottom: 0, top: "auto"}}>
            <Typography>endpoint: {this.state.endpoint}</Typography>
          </AppBar>
        </Fragment>
      </GlobalProvider>
    )
  }

}

export default Navigation;
