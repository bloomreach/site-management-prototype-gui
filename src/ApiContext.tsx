import React from 'react'
import {ChannelPageOperationsApi} from "./api";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";

const baseOptions = {
  auth:
    {
      username: 'admin',
      password: 'admin'
    }, withCredentials: true
}

const endpoint: string = 'http://localhost:8080/management/site/v1';

const channelPageOperationsApi: ChannelPageOperationsApi = new ChannelPageOperationsApi({
  baseOptions: baseOptions
}, endpoint);

const channelOperationsApi: ChannelOperationsApi = new ChannelOperationsApi({
  baseOptions: baseOptions
}, endpoint);

export const ChannelPageOperationsApiContext = React.createContext(channelPageOperationsApi);
export const ChannelOperationsApiContext = React.createContext(channelOperationsApi);