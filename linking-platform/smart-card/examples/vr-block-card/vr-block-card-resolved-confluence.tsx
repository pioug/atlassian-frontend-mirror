import React from 'react';
import { type JsonLd } from 'json-ld-types';
import { Client } from '@atlaskit/smart-card';
import VRCardView from '../utils/vr-card-view';
import { ConfluencePage, ConfluenceBlogPost } from '../../examples-helpers/_jsonLDExamples';

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

export const BlockCardConfluence = () => (
	<div>
		<h4>Confluence Blog</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={ConfluenceBlogPost.data.url} />
		<h4>Confluence Page</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={ConfluencePage.data.url} />
	</div>
);
export const BlockCardConfluenceLegacy = () => (
	<div>
		<h4>Confluence Blog</h4>
		<VRCardView
			appearance="block"
			client={new CustomClient()}
			url={ConfluenceBlogPost.data.url}
			useLegacyBlockCard={true}
		/>
		<h4>Confluence Page</h4>
		<VRCardView
			appearance="block"
			client={new CustomClient()}
			url={ConfluencePage.data.url}
			useLegacyBlockCard={true}
		/>
	</div>
);
