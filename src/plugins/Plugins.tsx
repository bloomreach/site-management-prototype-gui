import React from 'react';
import 'react-sortable-tree/style.css';
import {Nullable} from "../api/models/nullable";
import {LogContext} from "../LogContext";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    AppBar,
    Avatar,
    Button,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import ChannelSwitcher from "../common/ChannelSwitcher";
import {getGenericSiteApi, getPlugins} from "../ApiContext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddOutlinedIcon from "@material-ui/icons/Add";
import {Grid, List, ListItem} from "@mui/material";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

export interface Plugin {
    id: string;
    name: string;
    icon: string;
    description: string;
    isInstalled: boolean | false
    installationVerification: InstallationAction;
    installationActionSet: InstallationAction[];
}

export interface InstallationAction {
    description: string;
    type: string;
    path: string;
    method: string;
    body?: any;
    responseCode: number;
}

type PluginState = {
    currentChannelId: Nullable<string>
    plugins: Array<Plugin>
}
type PluginProps = {
    classes: any
}

// @ts-ignore
const styles = theme => {
    return ({
        heading: {
            paddingLeft: '10px',
            paddingTop: '7px',
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '50%',
            flexShrink: 0,
        },
        secondaryHeading: {
            paddingTop: '7px',
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    });
};

class Plugins extends React.Component<PluginProps, PluginState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: PluginProps) {
        super(props);

        this.state = {
            currentChannelId: null,
            plugins: []
        }
    }

    componentDidMount(): void {
        const pluginApi = getPlugins();
        pluginApi.get('https://bloomreach-content-tools.netlify.app/plugins.json').then(value => {
            this.setState({plugins: value.data});
        });
    }

    installPlugin(plugin: Plugin) {
        if (this.state?.currentChannelId) {
            const channelId = this.state.currentChannelId;
            const that = this;
            (async function () {
                const genericSiteApi = getGenericSiteApi();
                let success = true;
                let counter = 0;
                for (const installationAction of plugin.installationActionSet) {
                    try {
                        const result = await genericSiteApi.put(installationAction.path, channelId, installationAction.body)
                        if (result.status === installationAction.responseCode) {
                            counter++;
                        } else {
                            success = false;
                        }
                    } catch (error) {
                        success = false;
                    }
                }

                console.log('installation state', success);
                console.log('installation state installed actions', counter);
                that.onChannelChanged(channelId);
            })().then(value => {
                console.log('.. plugin installed');
            });
        }
    }

    handlePluginState(response: any, plugin: Plugin, channelId: string) {
        const verification = plugin.installationVerification;
        if (response.status === verification.responseCode) {
            let plugins = this.state.plugins.map(el => (
                el.id === plugin.id ? {...el, isInstalled: true} : el
            ))
            this.setState({plugins: plugins, currentChannelId: channelId})
        } else {
            let plugins = this.state.plugins.map(el => (
                el.id === plugin.id ? {...el, isInstalled: false} : el
            ))
            this.setState({plugins: plugins, currentChannelId: channelId})
        }
    }

    private onChannelChanged(channelId: string) {
        const genericSiteApi = getGenericSiteApi();
        if (this.state.plugins) {
            for (const plugin of this.state.plugins) {
                const verification = plugin.installationVerification;
                genericSiteApi.get(verification.path, channelId).then(response => {
                    this.handlePluginState(response, plugin, channelId);
                }).catch(error => {
                    error.response && this.handlePluginState(error.response, plugin, channelId);
                })
            }
        }
    }

    render() {
        const {classes} = this.props;
        return <>
            <AppBar position="sticky" variant={'outlined'} color={'default'}>
                <Toolbar>
                    <ChannelSwitcher onChannelChanged={channelId => this.onChannelChanged(channelId)}/>
                </Toolbar>
            </AppBar>
            {this.state.plugins.map((plugin: Plugin, index) => {
                return (
                    <Accordion key={this.state.currentChannelId + plugin.id}
                               onChange={(event, expanded) => console.log('on change of accordion', expanded)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Avatar variant={"square"} alt={plugin.name} src={plugin.icon}>{plugin.name}</Avatar>
                            <Typography className={classes.heading}>{plugin.name}</Typography>
                            <Typography
                                className={classes.secondaryHeading}>{plugin.isInstalled ? 'installed' : 'ready to install'}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant={'h5'}>Description:</Typography>
                                    <div dangerouslySetInnerHTML={{__html: plugin.description}}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'h5'}>Installation Instructions:</Typography>
                                    <List>
                                        {plugin.installationActionSet?.map(value => {
                                            return (
                                                <ListItem>
                                                    {value.description}
                                                </ListItem>)
                                        })}
                                    </List>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                        <AccordionActions>
                            <Button
                                disabled={plugin.isInstalled}
                                variant="outlined"
                                color="primary"
                                style={{marginRight: '10px'}}
                                startIcon={<AddOutlinedIcon/>}
                                onClick={() => this.installPlugin(plugin)}
                            >
                                Install
                            </Button>
                            {plugin.isInstalled && <Button
                                disabled={true}
                                variant="outlined"
                                color="primary"
                                style={{marginRight: '10px'}}
                                startIcon={<DeleteOutlinedIcon/>}
                            >
                                Uninstall
                            </Button>}
                        </AccordionActions>
                    </Accordion>
                )
            })}
        </>
    }
}

export default withStyles(styles)(Plugins);
