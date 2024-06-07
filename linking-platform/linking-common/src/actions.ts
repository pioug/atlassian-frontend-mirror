// TODO: eventually move this file to @atlaskit/link-actions

import { type JsonLd } from 'json-ld-types';
import { type CardActionType, type CardAction, type MetadataStatus } from './types';
import { type APIError } from './errors';
export const ACTION_PENDING = 'pending';
export const ACTION_RESOLVING = 'resolving';
export const ACTION_RESOLVED = 'resolved';
export const ACTION_RELOADING = 'reloading';
export const ACTION_ERROR = 'errored';
export const ACTION_ERROR_FALLBACK = 'fallback';
export const ACTION_PRELOAD = 'preload';
export const ACTION_UPDATE_METADATA_STATUS = 'metadata';

// export const ANALYTICS_RESOLVING = 'resolving';
// export const ANALYTICS_ERROR = 'errored';
// export const ANALYTICS_FALLBACK = 'fallback';

export type CardActionParams = {
	url: string;
};

export type CardBaseActionCreator<T = JsonLd.Response> = (
	type: CardActionType,
	params: CardActionParams,
	payload?: T,
	error?: APIError,
	/* The state of hover previews metadata */
	metadataStatus?: MetadataStatus,
	/* A flag which makes the reducer update the CardState regardless of the current and next status */
	ignoreStatusCheck?: boolean,
) => CardAction<T>;

export const cardAction: CardBaseActionCreator = (
	type,
	{ url },
	payload,
	error,
	metadataStatus,
	ignoreStatusCheck,
) => ({
	type,
	url,
	payload,
	error,
	metadataStatus,
	ignoreStatusCheck,
});
