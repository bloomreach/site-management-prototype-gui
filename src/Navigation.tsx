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
import Catalog from "./catalog/Catalog";
import LogProvider, {LogContext} from "./LogContext";
import Alert from '@material-ui/lab/Alert';
import Settings from "./settings/Settings";
import {Cookies} from "react-cookie";
import {setEndpoint} from "./common/common-utils";

type NavigationState = {
    tab: number,
    endpoint: string
}
type NavigationProps = {}

const cookies = new Cookies();

class Navigation extends React.Component<NavigationProps, NavigationState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: NavigationProps) {
        super(props);

        // @ts-ignore
        window._env_.BRX_NAMESPACE && cookies.set('namespace', window._env_.BRX_NAMESPACE);
        // @ts-ignore
        window._env_.BRX_API_KEY && cookies.set('apiKey', window._env_.BRX_API_KEY);

        const namespace = cookies.get('namespace');

        const endpoint = namespace ? `https://${namespace}.bloomreach.io/management/site/v1` : 'https://<namespace>.bloomreach.io/management/site/v1'

        namespace && setEndpoint(`https://${namespace}.bloomreach.io/management/site/v1`, this.context);

        this.state = {
            tab: namespace ? 0 : 5,
            endpoint: endpoint
        }

    }

    onTabChange(nextTab: number) {
        this.setState({tab: nextTab});
    }

    render() {
        const {tab} = this.state || 0;

        return (
            <LogProvider>
                <Fragment>
                    <AppBar position="sticky" color={'default'}>
                        <Tabs
                            variant="scrollable"
                            scrollButtons="auto"
                            value={tab} onChange={(event, nextTab) => this.onTabChange(nextTab)}>
                            <Tab label="Channels"/>
                            <Tab label="Layouts"/>
                            <Tab label="Components"/>
                            <Tab label="Routes"/>
                            <Tab label="Menus"/>
                            <Tab label="Settings"/>
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
                    <TabPanel value={tab} index={5}>
                        <Settings/>
                    </TabPanel>
                    <LogContext.Consumer>
                        {(props) => {
                            return (
                                <>
                                    <Snackbar
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                                        open={props.open}
                                        autoHideDuration={props.timeOut}
                                        onClose={props.onClose}>
                                        <Alert severity={props.severity}>
                                            {props.message}
                                        </Alert>
                                    </Snackbar>
                                    <AppBar style={{bottom: 0, top: "auto"}}>
                                        <Typography>endpoint: {props.endpoint ? props.endpoint : this.state.endpoint}</Typography>
                                    </AppBar>
                                </>
                            )
                        }}
                    </LogContext.Consumer>
                </Fragment>
            </LogProvider>
        )
    }

}

export default Navigation;
