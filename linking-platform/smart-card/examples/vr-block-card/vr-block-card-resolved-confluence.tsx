import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client } from '@atlaskit/link-provider';
import { ConfluenceBlogPost, ConfluencePage } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

const examples = {
	[ConfluenceBlogPost.data.url]: ConfluenceBlogPost,
	[ConfluencePage.data.url]: ConfluencePage,
};

class CustomClient extends Client {
	fetchData(url: string) {
		let response = { ...examples[url as keyof typeof examples] };
		return Promise.resolve(response as JsonLd.Response);
	}
}

export const BlockCardConfluence = (): React.JSX.Element => (
	<div>
		<h4>Confluence Blog</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={ConfluenceBlogPost.data.url} />
		<h4>Confluence Page</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={ConfluencePage.data.url} />
	</div>
);
