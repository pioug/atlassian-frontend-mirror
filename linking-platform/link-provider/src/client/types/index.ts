import { JsonLd } from 'json-ld-types';
import { InvokePayload, ServerActionOpts } from '@atlaskit/linking-common';
import Environments from '../utils/environments';

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
