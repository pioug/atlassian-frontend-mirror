import { type Store } from 'redux';
import { type CardType, type MetadataStatus } from './types';
import { type APIError } from './errors';

import { type SmartLinkResponse } from '@atlaskit/linking-types';

export interface CardStore {
	[key: string]: CardState;
}
export interface CardState {
	details?: SmartLinkResponse;
	error?: APIError;
	/** @deprecated Feature removed (EDM-2205) */
	lastUpdatedAt?: number;
	metadataStatus?: MetadataStatus;
	status: CardType;
}

export const getUrl = (store: Store<CardStore>, url: string) => {
	return (
		store.getState()[url] || {
			status: 'pending',
		}
	);
};
