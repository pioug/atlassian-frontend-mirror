import { type ServerActionOpts } from '@atlaskit/linking-common';

export interface ResolveRequest {
	resourceUrl: string;
	context?: string;
}

export interface BatchResolveRequest {
	resourceUrls: ResolveRequest[];
}

export type InvokeRequest = ServerActionOpts;

/** Payload when sending a search invoke request */
export interface SearchInvokeRequest {
	/** Search query. An empty string results in recent results being returned (pre-query). */
	query: string;
}
