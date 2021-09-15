import {ChannelPageOperationsApi} from "./api";
import {ChannelOperationsApi} from "./api/apis/channel-operations-api";
import {ChannelSitemapOperationsApi} from "./api/apis/channel-sitemap-operations-api";
import {ChannelSiteMenuOperationsApi} from "./api/apis/channel-site-menu-operations-api";
import {ChannelCatalogOperationsApi} from "./api/apis/channel-catalog-operations-api";
import {Cookies} from "react-cookie";

// @ts-ignore
// export const baseUrl: string = window._env_.BRX_BASE_URL!;

// export const endpoint: string = `${baseUrl}/management/site/v1`;

const cookies = new Cookies();

// export const channelPageOperationsApi: ChannelPageOperationsApi = new ChannelPageOperationsApi({
//     // @ts-ignore
//     apiKey: window._env_.BRX_API_KEY!
// }, endpoint);

export function getBaseUrl(): string {
    const namespace = cookies.get('namespace');
    return `https://${namespace}.bloomreach.io/management/site/v1`;
}

export function getChannelPageOperationsApi(): ChannelPageOperationsApi {
    const namespace = cookies.get('namespace');
    const apiKey = cookies.get('apiKey');
    return new ChannelPageOperationsApi({
        // @ts-ignore
        apiKey: apiKey
    }, `https://${namespace}.bloomreach.io/management/site/v1`);
}

export function getChannelOperationsApi(): ChannelOperationsApi {
    const namespace = cookies.get('namespace');
    const apiKey = cookies.get('apiKey');
    return new ChannelOperationsApi({
        // @ts-ignore
        apiKey: apiKey
    }, `https://${namespace}.bloomreach.io/management/site/v1`);
}

export function getChannelSiteMapOperationsApi(): ChannelSitemapOperationsApi {
    const namespace = cookies.get('namespace');
    const apiKey = cookies.get('apiKey');
    return new ChannelSitemapOperationsApi({
        // @ts-ignore
        apiKey: apiKey
    }, `https://${namespace}.bloomreach.io/management/site/v1`);
}

export function getChannelSiteMenuOperationsApi(): ChannelSiteMenuOperationsApi {
    const namespace = cookies.get('namespace');
    const apiKey = cookies.get('apiKey');
    return new ChannelSiteMenuOperationsApi({
        // @ts-ignore
        apiKey: apiKey
    }, `https://${namespace}.bloomreach.io/management/site/v1`);
}

export function getChannelCatalogOperationsApi(): ChannelCatalogOperationsApi {
    const namespace = cookies.get('namespace');
    const apiKey = cookies.get('apiKey');
    return new ChannelCatalogOperationsApi({
        // @ts-ignore
        apiKey: apiKey
    }, `https://${namespace}.bloomreach.io/management/site/v1`);
}


