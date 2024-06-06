import React from 'react';
import { type JsonLd } from 'json-ld-types';
import { Card, Client, Provider, TitleBlock } from '../../src';
import { response3 } from './example-responses';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(response3 as JsonLd.Response);
	}
}

export default () => (
	<Provider client={new CustomClient('stg')}>
		<Card
			appearance="inline"
			ui={{ hideHoverCardPreviewButton: true }}
			showHoverPreview={true}
			url={response3.data.url}
		>
			<TitleBlock />
		</Card>
	</Provider>
);
