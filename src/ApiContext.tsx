import {ChannelPageOperationsApi} from "./api";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";
import {ChannelSitemapOperationsApi} from "./api/apis/channel-sitemap-operations-api";
import {ChannelSiteMenuOperationsApi} from "./api/apis/channel-site-menu-operations-api";
import {ChannelCatalogOperationsApi} from "./api/apis/channel-catalog-operations-api";

// @ts-ignore
export const baseUrl: string = window._env_.BRX_BASE_URL!;

export const endpoint: string = `${baseUrl}/management/site/v1`;

export const channelPageOperationsApi: ChannelPageOperationsApi = new ChannelPageOperationsApi({
  // @ts-ignore
  apiKey: window._env_.BRX_API_KEY!
}, endpoint);


export const channelOperationsApi: ChannelOperationsApi = new ChannelOperationsApi({
  // @ts-ignore
  apiKey: window._env_.BRX_API_KEY!
}, endpoint);

export const channelSiteMapOperationsApi: ChannelSitemapOperationsApi = new ChannelSitemapOperationsApi({
  // @ts-ignore
  apiKey: window._env_.BRX_API_KEY!
}, endpoint);

export const channelSiteMenuOperationsApi: ChannelSiteMenuOperationsApi = new ChannelSiteMenuOperationsApi({
  // @ts-ignore
  apiKey: window._env_.BRX_API_KEY!
}, endpoint);

export const channelCatalogOperationsApi: ChannelCatalogOperationsApi = new ChannelCatalogOperationsApi({
  // @ts-ignore
  apiKey: window._env_.BRX_API_KEY!
}, endpoint);

