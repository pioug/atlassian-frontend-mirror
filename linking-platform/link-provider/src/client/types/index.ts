import { type JsonLd } from 'json-ld-types';
import { type InvokePayload, type ServerActionOpts } from '@atlaskit/linking-common';
import { type BatchResponse } from './responses';

export interface CardClient {
	/**
	 * Fetch data from URL
	 */
	fetchData(url: string): Promise<JsonLd.Response>;
	/**
	 * Feat data from list of ARIs
	 */
	fetchDataAris(aris: string[]): Promise<BatchResponse>;
	/**
	 * Fetch data from URL.
	 * The different between `prefetchData` and `fetchData` is that
	 * `prefetchData` will retry to resolve the URL if the URL does not resolve.
	 * Default retry is 2.
	 */
	prefetchData(url: string): Promise<JsonLd.Response | undefined>;
	/**
	 * Possible deprecation (EDM-11217), do not use.
	 */
	postData(data: InvokePayload<ServerActionOpts>): Promise<JsonLd.Response>;
}
