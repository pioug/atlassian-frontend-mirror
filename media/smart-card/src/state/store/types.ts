import { JsonLd, CardClient } from '../../client/types';
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
  details?: JsonLd;
  lastUpdatedAt: number;
}
export interface CardConnections {
  client: CardClient;
}
