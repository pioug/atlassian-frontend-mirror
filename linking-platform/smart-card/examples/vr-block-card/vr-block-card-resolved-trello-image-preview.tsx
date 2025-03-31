import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client } from '@atlaskit/link-provider';

import { TrelloCard } from '../../examples-helpers/_jsonLDExamples';
import VRCardView from '../utils/vr-card-view';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(TrelloCard as JsonLd.Response);
	}
}

export const BlockCardTrello = () => <VRCardView appearance="block" client={new CustomClient()} />;
