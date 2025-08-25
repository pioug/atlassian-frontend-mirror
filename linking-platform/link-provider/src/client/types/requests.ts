import { type ServerActionOpts } from '@atlaskit/linking-common';

export interface ResolveRequest {
	context?: string;
	resourceUrl: string;
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

type ResourcePayloadUrl = { ignoreCachedValue?: boolean; resourceUrl: string };
type ResourcePayloadAri = { ari: string };

export type ResourceType = 'URL' | 'ARI';
export type ResourcePayload<TType extends ResourceType> = TType extends 'URL'
	? ResourcePayloadUrl
	: ResourcePayloadAri;
