import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client } from '@atlaskit/link-provider';
import { TrelloCard } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

import '../utils/vr-preload-metadata-icons';

class CustomClient extends Client {
	fetchData(_: string) {
		return Promise.resolve(TrelloCard as JsonLd.Response);
	}
}

export const BlockCardTrello = (): React.JSX.Element => (
	<VRCardView appearance="block" client={new CustomClient()} />
);
