import Axios, { AxiosInstance, AxiosResponse } from "axios";
import { createLogger, Logger, transports, format } from "winston";

export class WebIrClient {

    private readonly TIMEOUT = 5000;
    private httpClient: AxiosInstance;

    private logger: Logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [new transports.Console()]
    });

    constructor() {
        this.httpClient = this.buildAxiosInstance();
    }

    private buildAxiosInstance(): AxiosInstance {
        const axiosInstance = Axios.create({
            // TODO update URL once the gateway exists. In this Axios configuration you will need to add the Basic auth to authentify against the gateway.
            baseURL: `${process.env.WEBIR_URL}/remote/send`,
            timeout: this.TIMEOUT
        });
        // Interceptor logging the requests
        axiosInstance.interceptors.request.use(request => {
            this.logger.info(`${request.method} request to ${request.url}`);
            return request;
        }, error => {
            this.logger.error(error.toJSON());
            return Promise.reject(error);
        });
        // Interceptor logging the responses
        axiosInstance.interceptors.response.use(response => {
            this.logger.info(`Response with status ${response.status} and payload ${JSON.stringify(response.data)}`);
            return response;
        });
        return axiosInstance;
    }

    sendCodes(codes: string[], count?: number): Promise<AxiosResponse<WebIrResponse>> {
        const jointCodes = codes.join(",");
        const params = count ? {count} : undefined;
        return this.sendGetRequestWithConnectionTimeout(`/codes/${jointCodes}`, params);
    }

    sendInteger(int: number, count?: number): Promise<AxiosResponse<WebIrResponse>> {
        const params = count ? {count} : undefined;
        return this.sendGetRequestWithConnectionTimeout(`/integer/${int}`, params);
    }

    sendChannel(channelName: string): Promise<AxiosResponse<WebIrResponse>> {
        return this.sendGetRequestWithConnectionTimeout(`/channel/${channelName}`);
    }

    private sendGetRequestWithConnectionTimeout(url: string, parameters?: any): Promise<AxiosResponse<WebIrResponse>> {
        // This is a shitty workaround because the great Axios does not support connection timeouts, only response timeouts.
        const source = Axios.CancelToken.source();
        setTimeout(() => {
            source.cancel();
        }, this.TIMEOUT);
        return this.httpClient.get(url, {
            cancelToken: source.token,
            params: parameters
        });
    }
}

export interface WebIrResponse {
    status: string,
    payload: string | string[] | number
}