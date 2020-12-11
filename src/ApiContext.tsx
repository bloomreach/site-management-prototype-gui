import React, {Context} from 'react'
import {ChannelPageOperationsApi, Configuration} from "./api";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";
import {Page} from "./api/models";
import {TreeItem} from "react-sortable-tree";
import {ChannelSitemapOperationsApi} from "./api/apis/channel-sitemap-operations-api";

const baseOptions = {
  auth:
    {
      username: 'admin',
      password: 'admin'
    }, withCredentials: true
};

export const endpoint: string = 'http://localhost:8080/management/site/v1';

export const channelPageOperationsApi: ChannelPageOperationsApi = new ChannelPageOperationsApi({
  baseOptions: baseOptions
}, endpoint);

export const channelOperationsApi: ChannelOperationsApi = new ChannelOperationsApi({
  baseOptions: baseOptions
}, endpoint);

export const channelSiteMapOperationsApi: ChannelSitemapOperationsApi = new ChannelSitemapOperationsApi({
  baseOptions: baseOptions
}, endpoint);

// export interface ApiContextType extends Context {
//   channelPageOperationsApi: ChannelPageOperationsApi
//   channelOperationsApi: ChannelOperationsApi
// }
//
// export const ApiContext: ApiContextType = React.createContext({
//   channelPageOperationsApi: channelPageOperationsApi,
//   channelOperationsApi: channelOperationsApi
// });
