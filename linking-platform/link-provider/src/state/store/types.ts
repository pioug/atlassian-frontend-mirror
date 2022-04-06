import { JsonLd } from 'json-ld-types';
import { CardType } from '@atlaskit/linking-common';
import { CardClient, APIError } from '../..';

export type { CardType };

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
