import { JsonLd } from 'json-ld-types';
import Environments from '../utils/environments';
import { InvokePayload, ServerActionOpts } from '../../model/invoke-opts';

export interface CardClient {
  fetchData(url: string): Promise<JsonLd.Response>;
  prefetchData(url: string): Promise<JsonLd.Response | undefined>;
  postData(data: InvokePayload<ServerActionOpts>): Promise<JsonLd.Response>;
}

export type ClientEnvironment = {
  baseUrl: string;
  resolverUrl: string;
};
export type EnvironmentsKeys = keyof typeof Environments;
