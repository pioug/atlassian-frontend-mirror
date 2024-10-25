import React from 'react';

import { type JsonLd } from 'json-ld-types';

import { Client } from '@atlaskit/smart-card';

import { TrelloCard } from '../../examples-helpers/_jsonLDExamples';
import VRCardView from '../utils/vr-card-view';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(TrelloCard as JsonLd.Response);
	}
}

export const BlockCardTrello = () => <VRCardView appearance="block" client={new CustomClient()} />;

export const BlockCardTrelloLegacy = () => (
	<VRCardView appearance="block" client={new CustomClient()} useLegacyBlockCard={true} />
);
