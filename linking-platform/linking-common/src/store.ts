import { type Store } from 'redux';

import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import type { APIError } from './APIError';
import { type CardType, type MetadataStatus } from './types';

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

export const getUrl = (store: Store<CardStore>, url: string): CardState => {
	return (
		store.getState()[url] || {
			status: 'pending',
		}
	);
};
