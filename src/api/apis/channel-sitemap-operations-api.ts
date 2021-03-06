/* tslint:disable */
/* eslint-disable */
/**
 * 
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { SitemapItem } from '../models/site';
/**
 * ChannelSitemapOperationsApi - axios parameter creator
 * @export
 */
export const ChannelSitemapOperationsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Delete a route
         * @param {string} channelId 
         * @param {string} routeName
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteChannelSitemapItem: async (channelId: string, routeName: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'channelId' is not null or undefined
            if (channelId === null || channelId === undefined) {
                throw new RequiredError('channelId','Required parameter channelId was null or undefined when calling deleteChannelSitemapItem.');
            }
            // verify required parameter 'routeName' is not null or undefined
            if (routeName === null || routeName === undefined) {
                throw new RequiredError('routeName','Required parameter routeName was null or undefined when calling deleteChannelSitemapItem.');
            }
            const localVarPath = `/channels/{channel_id}/routes/{route_name}`
                .replace(`{${"channel_id"}}`, encodeURIComponent(String(channelId)))
                .replace(`{${"route_name"}}`, encodeURIComponent(String(routeName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-auth-token")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-auth-token"] = localVarApiKeyValue;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get the channel route
         * @param {string} channelId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChannelSitemap: async (channelId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'channelId' is not null or undefined
            if (channelId === null || channelId === undefined) {
                throw new RequiredError('channelId','Required parameter channelId was null or undefined when calling getChannelSitemap.');
            }
            const localVarPath = `/channels/{channel_id}/routes`
                .replace(`{${"channel_id"}}`, encodeURIComponent(String(channelId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-auth-token")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-auth-token"] = localVarApiKeyValue;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get a route
         * @param {string} channelId 
         * @param {string} routeName
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChannelSitemapItem: async (channelId: string, routeName: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'channelId' is not null or undefined
            if (channelId === null || channelId === undefined) {
                throw new RequiredError('channelId','Required parameter channelId was null or undefined when calling getChannelSitemapItem.');
            }
            // verify required parameter 'routeName' is not null or undefined
            if (routeName === null || routeName === undefined) {
                throw new RequiredError('routeName','Required parameter routeName was null or undefined when calling getChannelSitemapItem.');
            }
            const localVarPath = `/channels/{channel_id}/routes/{route_name}`
                .replace(`{${"channel_id"}}`, encodeURIComponent(String(channelId)))
                .replace(`{${"route_name"}}`, encodeURIComponent(String(routeName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-auth-token")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-auth-token"] = localVarApiKeyValue;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Create or update a route
         * @param {string} channelId 
         * @param {string} routeName
         * @param {SitemapItem} [body] 
         * @param {string} [xResourceVersion] Resource&#x27;s version
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putChannelSitemapItem: async (channelId: string, routeName: string, body?: SitemapItem, xResourceVersion?: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'channelId' is not null or undefined
            if (channelId === null || channelId === undefined) {
                throw new RequiredError('channelId','Required parameter channelId was null or undefined when calling putChannelSitemapItem.');
            }
            // verify required parameter 'routeName' is not null or undefined
            if (routeName === null || routeName === undefined) {
                throw new RequiredError('routeName','Required parameter routeName was null or undefined when calling putChannelSitemapItem.');
            }
            const localVarPath = `/channels/{channel_id}/routes/{route_name}`
                .replace(`{${"channel_id"}}`, encodeURIComponent(String(channelId)))
                .replace(`{${"route_name"}}`, encodeURIComponent(String(routeName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-auth-token")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-auth-token"] = localVarApiKeyValue;
            }

            if (xResourceVersion !== undefined && xResourceVersion !== null) {
                localVarHeaderParameter['X-Resource-Version'] = String(xResourceVersion);
            }

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ChannelSitemapOperationsApi - functional programming interface
 * @export
 */
export const ChannelSitemapOperationsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Delete a route
         * @param {string} channelId 
         * @param {string} routeName
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteChannelSitemapItem(channelId: string, itemName: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await ChannelSitemapOperationsApiAxiosParamCreator(configuration).deleteChannelSitemapItem(channelId, itemName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get the channel route
         * @param {string} channelId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getChannelSitemap(channelId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<SitemapItem>>> {
            const localVarAxiosArgs = await ChannelSitemapOperationsApiAxiosParamCreator(configuration).getChannelSitemap(channelId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get a route
         * @param {string} channelId 
         * @param {string} routeName
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getChannelSitemapItem(channelId: string, itemName: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SitemapItem>> {
            const localVarAxiosArgs = await ChannelSitemapOperationsApiAxiosParamCreator(configuration).getChannelSitemapItem(channelId, itemName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Create or update a route
         * @param {string} channelId 
         * @param {string} routeName
         * @param {SitemapItem} [body] 
         * @param {string} [xResourceVersion] Resource&#x27;s version
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putChannelSitemapItem(channelId: string, itemName: string, body?: SitemapItem, xResourceVersion?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SitemapItem>> {
            const localVarAxiosArgs = await ChannelSitemapOperationsApiAxiosParamCreator(configuration).putChannelSitemapItem(channelId, itemName, body, xResourceVersion, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ChannelSitemapOperationsApi - factory interface
 * @export
 */
export const ChannelSitemapOperationsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Delete a sitemap item
         * @param {string} channelId 
         * @param {string} itemName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteChannelSitemapItem(channelId: string, itemName: string, options?: any): AxiosPromise<void> {
            return ChannelSitemapOperationsApiFp(configuration).deleteChannelSitemapItem(channelId, itemName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get the channel sitemap
         * @param {string} channelId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChannelSitemap(channelId: string, options?: any): AxiosPromise<Array<SitemapItem>> {
            return ChannelSitemapOperationsApiFp(configuration).getChannelSitemap(channelId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get a sitemap item
         * @param {string} channelId 
         * @param {string} itemName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChannelSitemapItem(channelId: string, itemName: string, options?: any): AxiosPromise<SitemapItem> {
            return ChannelSitemapOperationsApiFp(configuration).getChannelSitemapItem(channelId, itemName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Create or update a sitemap item
         * @param {string} channelId 
         * @param {string} itemName 
         * @param {SitemapItem} [body] 
         * @param {string} [xResourceVersion] Resource&#x27;s version
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putChannelSitemapItem(channelId: string, itemName: string, body?: SitemapItem, xResourceVersion?: string, options?: any): AxiosPromise<SitemapItem> {
            return ChannelSitemapOperationsApiFp(configuration).putChannelSitemapItem(channelId, itemName, body, xResourceVersion, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ChannelSitemapOperationsApi - object-oriented interface
 * @export
 * @class ChannelSitemapOperationsApi
 * @extends {BaseAPI}
 */
export class ChannelSitemapOperationsApi extends BaseAPI {
    /**
     * 
     * @summary Delete a sitemap item
     * @param {string} channelId 
     * @param {string} itemName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChannelSitemapOperationsApi
     */
    public deleteChannelSitemapItem(channelId: string, itemName: string, options?: any) {
        return ChannelSitemapOperationsApiFp(this.configuration).deleteChannelSitemapItem(channelId, itemName, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get the channel sitemap
     * @param {string} channelId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChannelSitemapOperationsApi
     */
    public getChannelSitemap(channelId: string, options?: any) {
        return ChannelSitemapOperationsApiFp(this.configuration).getChannelSitemap(channelId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get a sitemap item
     * @param {string} channelId 
     * @param {string} itemName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChannelSitemapOperationsApi
     */
    public getChannelSitemapItem(channelId: string, itemName: string, options?: any) {
        return ChannelSitemapOperationsApiFp(this.configuration).getChannelSitemapItem(channelId, itemName, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Create or update a sitemap item
     * @param {string} channelId 
     * @param {string} itemName 
     * @param {SitemapItem} [body] 
     * @param {string} [xResourceVersion] Resource&#x27;s version
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChannelSitemapOperationsApi
     */
    public putChannelSitemapItem(channelId: string, itemName: string, body?: SitemapItem, xResourceVersion?: string, options?: any) {
        return ChannelSitemapOperationsApiFp(this.configuration).putChannelSitemapItem(channelId, itemName, body, xResourceVersion, options).then((request) => request(this.axios, this.basePath));
    }
}
