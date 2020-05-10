import Axios, { AxiosInstance, AxiosResponse } from "axios";
import { createLogger, Logger, transports, format } from "winston";

export class WebIrClient {

    private httpClient: AxiosInstance;

    private logger: Logger = createLogger({
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
        transports: [ new transports.Console() ]
      });

    constructor() {
        this.httpClient = this.buildAxiosInstance();
    }

    private buildAxiosInstance(): AxiosInstance {
        const axiosInstance = Axios.create({
            // TODO update URL once the gateway exists. In this Axios configuration you will need to add the Basic auth to authentify against the gateway.
            baseURL: "http://pi.bujalancedev.com/remote/send",
            timeout: 5000
        });
        // Interceptor logging the requests
        axiosInstance.interceptors.request.use(request => {
            this.logger.debug(`${request.method} request to ${request.url}`);
            return request;
        });
        // Interceptor logging the responses
        axiosInstance.interceptors.response.use(response => {
            this.logger.debug(`Respnse with status ${response.status} and payload ${response.data}`);
            return response;
        });
        return axiosInstance;
    }

    sendCodes(codes: string[]): Promise<AxiosResponse<WebIrResponse>> {
        const jointCodes = codes.join(",");
        return this.httpClient.get(`/codes/${jointCodes}`);
    }

    sendInteger(int: number): Promise<AxiosResponse<WebIrResponse>> {
        return this.httpClient.get(`/integer/${int}`);
    }
}

export interface WebIrResponse {
    status: string,
    payload: string | string[] | number
}