import { type JsonLd } from 'json-ld-types';
import { type Store } from 'redux';
import { type CardType, type MetadataStatus } from './types';
import { type APIError } from './errors';

export interface CardStore {
	[key: string]: CardState;
}
export interface CardState {
	status: CardType;
	details?: JsonLd.Response;
	/** @deprecated Feature removed (EDM-2205) */
	lastUpdatedAt?: number;
	error?: APIError;
	metadataStatus?: MetadataStatus;
}

export const getUrl = (store: Store<CardStore>, url: string) => {
	return (
		store.getState()[url] || {
			status: 'pending',
		}
	);
};
