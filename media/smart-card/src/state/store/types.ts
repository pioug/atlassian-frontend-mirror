import { JsonLd } from 'json-ld-types';

import { CardClient } from '../../client/types';
import { APIError } from '../../client/errors';
import { CardActionType } from '../actions/types';

export type CardType =
  | CardActionType
  | 'unauthorized'
  | 'forbidden'
  | 'errored'
  | 'not_found';

export interface CardStore {
  [key: string]: CardState;
}
export interface CardState {
  status: CardType;
  details?: JsonLd.Response;
  /** @deprecated Feature removed (EDM-2205) */
  lastUpdatedAt?: number;
  error?: APIError;
}
export interface CardConnections {
  client: CardClient;
}
