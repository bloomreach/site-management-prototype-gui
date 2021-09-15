import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import 'react-sortable-tree/style.css';
import {Channel} from "../api/models";
import {LogContext} from "../LogContext";
import {JSONSchema7} from "json-schema";
import Form from "@rjsf/material-ui";
import {Cookies} from "react-cookie";
import {Container} from "@material-ui/core";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import AdjustOutlinedIcon from '@material-ui/icons/AdjustOutlined';
import {ChannelOperationsApi} from "../api/apis/channel-operations-api";
import {logError, logSuccess, setEndpoint} from "../common/common-utils";

type SettingState = {
    channels: Array<Channel>
    namespace: string | undefined
    apiKey: string | undefined
}
type SettingProps = {
    // endpoint: string
}

export const settingSchema = {
    type: "object",
    properties: {
        namespace: {
            type: "string",
        },
        apiKey: {
            type: "string",
        }
    }
};

const cookies = new Cookies();

class Settings extends React.Component<SettingProps, SettingState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: SettingProps) {
        super(props);

        this.state = {
            channels: [],
            namespace: cookies.get("namespace"),
            apiKey: cookies.get('apiKey')
        }
    }

    componentDidMount(): void {
    }

    testConnection({apiKey, namespace}: { apiKey: string | undefined; namespace: string | undefined }): void {
        const api: ChannelOperationsApi = new ChannelOperationsApi({
            // @ts-ignore
            apiKey: apiKey
        }, `https://${namespace}.bloomreach.io/management/site/v1`);
        api.getChannels().then(value => {
            let data: Array<Channel> = value.data;
            data.map(channel => {
                if (channel.responseHeaders === null) {
                    channel.responseHeaders = {};
                }
                return channel;
            });
            this.setState({channels: data, namespace:namespace, apiKey:apiKey});
            logSuccess('Connection Successful', this.context);
        }).catch(reason => logError("Connection Failed", this.context));
    }

    save({apiKey, namespace}: { apiKey: string | undefined; namespace: string | undefined }): void {
        this.setState({namespace: namespace, apiKey: apiKey}, () => {
            cookies.set('namespace', namespace, {secure:true, sameSite:'strict'});
            cookies.set('apiKey', apiKey, {secure:true, sameSite:'strict'});
            setEndpoint(`https://${namespace}.bloomreach.io/management/site/v1`, this.context);
        })
    }

    render() {
        const {namespace, apiKey} = this.state;
        let settingsModel = {namespace: namespace, apiKey: apiKey};

        return <Container style={{margin: 'auto', display: 'flex', justifyContent: 'center', padding: '50px'}}>
            <Card>
                <CardContent>
                    <Form
                        formData={settingsModel}
                        schema={settingSchema as JSONSchema7}
                        onChange={({formData}) => (settingsModel = formData)}
                    >
                        <></>
                    </Form>
                </CardContent>
                <CardActions>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<AdjustOutlinedIcon/>}
                        onClick={() => this.testConnection(settingsModel)}
                    >
                        Test Connection
                    </Button>
                    <Button
                        // disabled={!isNotEmptyOrNull(this.state.channels)}
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<SaveOutlinedIcon/>}
                        onClick={() => this.save(settingsModel)}
                    >
                        Save
                    </Button>
                </CardActions>
            </Card>
        </Container>
    }


}

export default Settings;
