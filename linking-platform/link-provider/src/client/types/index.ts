import { type JsonLd } from 'json-ld-types';
import { type InvokePayload, type ServerActionOpts } from '@atlaskit/linking-common';

export interface CardClient {
  fetchData(url: string): Promise<JsonLd.Response>;
  prefetchData(url: string): Promise<JsonLd.Response | undefined>;
  postData(data: InvokePayload<ServerActionOpts>): Promise<JsonLd.Response>;
}
