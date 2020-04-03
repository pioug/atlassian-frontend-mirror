import { JsonLd } from '../../client/types';
import { AnyAction } from 'redux';

export type CardActionType = 'pending' | 'resolving' | 'resolved' | 'errored';
export type ServerErrors =
  | 'InternalServerError'
  | 'ResolveBadRequestError'
  | 'ResolveUnsupportedError'
  | 'ResolveAuthError'
  | 'ResolveTimeoutError';

export interface CardAction<T = JsonLd> extends AnyAction {
  type: CardActionType;
  url: string;
  payload?: T;
}

export type CardActionParams = {
  url: string;
};

export type CardBaseActionCreator<T = JsonLd> = (
  type: CardActionType,
  params: CardActionParams,
  payload?: T,
) => CardAction<T>;
