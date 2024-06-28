import { type JsonLd } from 'json-ld-types';
import { type InvokePayload, type ServerActionOpts } from '@atlaskit/linking-common';
import { type BatchResponse } from './responses';

export interface CardClient {
	fetchData(url: string): Promise<JsonLd.Response>;
	fetchDataAris(aris: string[]): Promise<BatchResponse>;
	prefetchData(url: string): Promise<JsonLd.Response | undefined>;
	postData(data: InvokePayload<ServerActionOpts>): Promise<JsonLd.Response>;
}
