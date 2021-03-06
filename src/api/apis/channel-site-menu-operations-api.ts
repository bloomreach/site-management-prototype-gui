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
/**
 * ChannelSiteMenuOperationsApi - axios parameter creator
 * @export
 */
export const ChannelSiteMenuOperationsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Delete a channel sitemenu
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteChannelSitemenu: async (channelId: string, menuName: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'channelId' is not null or undefined
            if (channelId === null || channelId === undefined) {
                throw new RequiredError('channelId','Required parameter channelId was null or undefined when calling deleteChannelSitemenu.');
            }
            // verify required parameter 'menuName' is not null or undefined
            if (menuName === null || menuName === undefined) {
                throw new RequiredError('menuName','Required parameter menuName was null or undefined when calling deleteChannelSitemenu.');
            }
            const localVarPath = `/channels/{channel_id}/menus/{menu_name}`
                .replace(`{${"channel_id"}}`, encodeURIComponent(String(channelId)))
                .replace(`{${"menu_name"}}`, encodeURIComponent(String(menuName)));
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
         * @summary Get a channel sitemenu (name)
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChannelSitemenu: async (channelId: string, menuName: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'channelId' is not null or undefined
            if (channelId === null || channelId === undefined) {
                throw new RequiredError('channelId','Required parameter channelId was null or undefined when calling getChannelSitemenu.');
            }
            // verify required parameter 'menuName' is not null or undefined
            if (menuName === null || menuName === undefined) {
                throw new RequiredError('menuName','Required parameter menuName was null or undefined when calling getChannelSitemenu.');
            }
            const localVarPath = `/channels/{channel_id}/menus/{menu_name}`
                .replace(`{${"channel_id"}}`, encodeURIComponent(String(channelId)))
                .replace(`{${"menu_name"}}`, encodeURIComponent(String(menuName)));
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
         * @summary Get all channel sitemenus (names)
         * @param {string} channelId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChannelSitemenus: async (channelId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'channelId' is not null or undefined
            if (channelId === null || channelId === undefined) {
                throw new RequiredError('channelId','Required parameter channelId was null or undefined when calling getChannelSitemenus.');
            }
            const localVarPath = `/channels/{channel_id}/menus`
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
         * @summary Create a channel sitemenu (name)
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {string} [xResourceVersion] Resource&#x27;s version
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putChannelSitemenu: async (channelId: string, menuName: string, xResourceVersion?: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'channelId' is not null or undefined
            if (channelId === null || channelId === undefined) {
                throw new RequiredError('channelId','Required parameter channelId was null or undefined when calling putChannelSitemenu.');
            }
            // verify required parameter 'menuName' is not null or undefined
            if (menuName === null || menuName === undefined) {
                throw new RequiredError('menuName','Required parameter menuName was null or undefined when calling putChannelSitemenu.');
            }
            const localVarPath = `/channels/{channel_id}/menus/{menu_name}`
                .replace(`{${"channel_id"}}`, encodeURIComponent(String(channelId)))
                .replace(`{${"menu_name"}}`, encodeURIComponent(String(menuName)));
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
    }
};

/**
 * ChannelSiteMenuOperationsApi - functional programming interface
 * @export
 */
export const ChannelSiteMenuOperationsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Delete a channel sitemenu
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteChannelSitemenu(channelId: string, menuName: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await ChannelSiteMenuOperationsApiAxiosParamCreator(configuration).deleteChannelSitemenu(channelId, menuName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get a channel sitemenu (name)
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getChannelSitemenu(channelId: string, menuName: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await ChannelSiteMenuOperationsApiAxiosParamCreator(configuration).getChannelSitemenu(channelId, menuName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Get all channel sitemenus (names)
         * @param {string} channelId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getChannelSitemenus(channelId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<any>>> {
            const localVarAxiosArgs = await ChannelSiteMenuOperationsApiAxiosParamCreator(configuration).getChannelSitemenus(channelId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Create a channel sitemenu (name)
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {string} [xResourceVersion] Resource&#x27;s version
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putChannelSitemenu(channelId: string, menuName: string, xResourceVersion?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await ChannelSiteMenuOperationsApiAxiosParamCreator(configuration).putChannelSitemenu(channelId, menuName, xResourceVersion, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ChannelSiteMenuOperationsApi - factory interface
 * @export
 */
export const ChannelSiteMenuOperationsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Delete a channel sitemenu
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteChannelSitemenu(channelId: string, menuName: string, options?: any): AxiosPromise<void> {
            return ChannelSiteMenuOperationsApiFp(configuration).deleteChannelSitemenu(channelId, menuName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get a channel sitemenu (name)
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChannelSitemenu(channelId: string, menuName: string, options?: any): AxiosPromise<string> {
            return ChannelSiteMenuOperationsApiFp(configuration).getChannelSitemenu(channelId, menuName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get all channel sitemenus (names)
         * @param {string} channelId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChannelSitemenus(channelId: string, options?: any): AxiosPromise<Array<any>> {
            return ChannelSiteMenuOperationsApiFp(configuration).getChannelSitemenus(channelId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Create a channel sitemenu (name)
         * @param {string} channelId 
         * @param {string} menuName 
         * @param {string} [xResourceVersion] Resource&#x27;s version
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putChannelSitemenu(channelId: string, menuName: string, xResourceVersion?: string, options?: any): AxiosPromise<string> {
            return ChannelSiteMenuOperationsApiFp(configuration).putChannelSitemenu(channelId, menuName, xResourceVersion, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ChannelSiteMenuOperationsApi - object-oriented interface
 * @export
 * @class ChannelSiteMenuOperationsApi
 * @extends {BaseAPI}
 */
export class ChannelSiteMenuOperationsApi extends BaseAPI {
    /**
     * 
     * @summary Delete a channel sitemenu
     * @param {string} channelId 
     * @param {string} menuName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChannelSiteMenuOperationsApi
     */
    public deleteChannelSitemenu(channelId: string, menuName: string, options?: any) {
        return ChannelSiteMenuOperationsApiFp(this.configuration).deleteChannelSitemenu(channelId, menuName, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get a channel sitemenu (name)
     * @param {string} channelId 
     * @param {string} menuName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChannelSiteMenuOperationsApi
     */
    public getChannelSitemenu(channelId: string, menuName: string, options?: any) {
        return ChannelSiteMenuOperationsApiFp(this.configuration).getChannelSitemenu(channelId, menuName, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Get all channel sitemenus (names)
     * @param {string} channelId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChannelSiteMenuOperationsApi
     */
    public getChannelSitemenus(channelId: string, options?: any) {
        return ChannelSiteMenuOperationsApiFp(this.configuration).getChannelSitemenus(channelId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Create a channel sitemenu (name)
     * @param {string} channelId 
     * @param {string} menuName 
     * @param {string} [xResourceVersion] Resource&#x27;s version
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChannelSiteMenuOperationsApi
     */
    public putChannelSitemenu(channelId: string, menuName: string, xResourceVersion?: string, options?: any) {
        return ChannelSiteMenuOperationsApiFp(this.configuration).putChannelSitemenu(channelId, menuName, xResourceVersion, options).then((request) => request(this.axios, this.basePath));
    }
}
