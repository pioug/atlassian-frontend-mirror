import { type CardAppearance, type ServerActionOpts } from '@atlaskit/linking-common';

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

type ResourcePayloadUrl = {
	/**
	 * Card appearance hint for ORS to optimize response payload.
	 * When 'inline', ORS returns minimal data (title, status).
	 * When 'block' or 'embed', ORS returns full data including summary.
	 */
	appearance?: CardAppearance;
	ignoreCachedValue?: boolean;
	resourceUrl: string;
};
type ResourcePayloadAri = { ari: string };

export type ResourceType = 'URL' | 'ARI';
export type ResourcePayload<TType extends ResourceType> = TType extends 'URL'
	? ResourcePayloadUrl
	: ResourcePayloadAri;
