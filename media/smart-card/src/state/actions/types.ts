import { AnyAction } from 'redux';
import { JsonLd } from 'json-ld-types';

import { APIError } from '../../client/errors';

export type CardActionType =
  | 'pending'
  | 'resolving'
  | 'resolved'
  | 'errored'
  | 'fallback';

export interface CardAction<T = JsonLd.Response> extends AnyAction {
  type: CardActionType;
  url: string;
  payload?: T;
}

export type CardActionParams = {
  url: string;
};

export type CardBaseActionCreator<T = JsonLd.Response> = (
  type: CardActionType,
  params: CardActionParams,
  payload?: T,
  error?: APIError,
) => CardAction<T>;
