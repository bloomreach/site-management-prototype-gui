import {ChannelPageOperationsApi} from "./api";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";
import {ChannelSitemapOperationsApi} from "./api/apis/channel-sitemap-operations-api";
import {ChannelSiteMenuOperationsApi} from "./api/apis/channel-site-menu-operations-api";
import {ChannelCatalogOperationsApi} from "./api/apis/channel-catalog-operations-api";

const baseOptions = {
  auth:
    {
      username: 'admin',
      password: 'admin'
    }, withCredentials: true
};

export const baseUrl: string = 'http://localhost:8080';

export const endpoint: string = `${baseUrl}/management/site/v1`;

export const channelPageOperationsApi: ChannelPageOperationsApi = new ChannelPageOperationsApi({
  baseOptions: baseOptions
}, endpoint);

export const channelOperationsApi: ChannelOperationsApi = new ChannelOperationsApi({
  baseOptions: baseOptions
}, endpoint);

export const channelSiteMapOperationsApi: ChannelSitemapOperationsApi = new ChannelSitemapOperationsApi({
  baseOptions: baseOptions
}, endpoint);

export const channelSiteMenuOperationsApi: ChannelSiteMenuOperationsApi = new ChannelSiteMenuOperationsApi({
  baseOptions: baseOptions
}, endpoint);

export const channelCatalogOperationsApi: ChannelCatalogOperationsApi = new ChannelCatalogOperationsApi({
  baseOptions: baseOptions
}, endpoint);

