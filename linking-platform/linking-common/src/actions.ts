// TODO: eventually move this file to @atlaskit/link-actions

import { JsonLd } from 'json-ld-types';
import { CardActionType, CardAction } from './types';
import { APIError } from './errors';
export const ACTION_PENDING = 'pending';
export const ACTION_RESOLVING = 'resolving';
export const ACTION_RESOLVED = 'resolved';
export const ACTION_RELOADING = 'reloading';
export const ACTION_ERROR = 'errored';
export const ACTION_ERROR_FALLBACK = 'fallback';
export const ACTION_PRELOAD = 'preload';

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
) => CardAction<T>;

export const cardAction: CardBaseActionCreator = (
  type,
  { url },
  payload,
  error,
) => ({
  type,
  url,
  payload,
  error,
});
