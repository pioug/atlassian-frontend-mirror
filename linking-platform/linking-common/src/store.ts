import { JsonLd } from 'json-ld-types';
import { Store } from 'redux';
import { CardType } from './types';
import { APIError } from './errors';

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

export const getUrl = (store: Store<CardStore>, url: string) => {
  return (
    store.getState()[url] || {
      status: 'pending',
    }
  );
};
