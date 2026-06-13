import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	type CardAppearance,
	type InvokePayload,
	type ServerActionOpts,
} from '@atlaskit/linking-common';
import { type BatchResponse } from './responses';

export interface CardClient {
	/**
	 * Fetch data from URL
	 * @param url - The URL to fetch data for
	 * @param force - Whether to force a fresh fetch, bypassing cache
	 * @param appearance - Card appearance hint for ORS to optimize response payload.
	 *                     When 'inline', ORS returns minimal data (title, status).
	 *                     When 'block' or 'embed', ORS returns full data including summary.
	 */
	fetchData(url: string, force?: boolean, appearance?: CardAppearance): Promise<JsonLd.Response>;
	/**
	 * Feat data from list of ARIs
	 */
	fetchDataAris(aris: string[]): Promise<BatchResponse>;
	/**
	 * Possible deprecation (EDM-11217), do not use.
	 */
	postData(data: InvokePayload<ServerActionOpts>): Promise<JsonLd.Response>;
	/**
	 * Fetch data from URL.
	 * The different between `prefetchData` and `fetchData` is that
	 * `prefetchData` will retry to resolve the URL if the URL does not resolve.
	 * Default retry is 2.
	 * @param url - The URL to prefetch data for
	 * @param appearance - Card appearance hint for ORS to optimize response payload.
	 */
	prefetchData(url: string, appearance?: CardAppearance): Promise<JsonLd.Response | undefined>;
}
