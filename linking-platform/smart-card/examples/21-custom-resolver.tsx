import { Stack } from '@atlaskit/primitives';
import React from 'react';
import { AsanaTask } from '../examples-helpers/_jsonLDExamples';
import '../examples-helpers';
import urlsJSON from '../examples-helpers/example-urls.json';
import { Card, Client, Provider } from '../src';
import ExampleContainer from './utils/example-container';

class CustomClient extends Client {
	fetchData(_url: string) {
		return Promise.resolve(AsanaTask);
	}
}

const clientWithResolver = new CustomClient('staging');

function urlWithCard(url: string) {
	return (
		<>
			<p>
				This URL: <a>{url}</a> maps to this card:
			</p>
			<Card url={url} appearance="block" />
		</>
	);
}

export default () => (
	<ExampleContainer title="Custom Resolver">
		<Stack space="space.200">
			<Provider client={new Client('staging')}>
				<h2>
					These card <em>DO NOT</em> use an custom resolver.
				</h2>
				{urlWithCard(urlsJSON[0].url)}
				{urlWithCard(urlsJSON[1].url)}
			</Provider>
			<Provider client={clientWithResolver}>
				<h2>
					These cards <em>DO</em> use an additional resolver.
				</h2>
				<p>
					Notice how the same URLs resolve to different things, since we've intercepted the requests
					using a custom resolver.
				</p>
				{urlWithCard(urlsJSON[0].url)}
				{urlWithCard(urlsJSON[1].url)}
			</Provider>
		</Stack>
	</ExampleContainer>
);
