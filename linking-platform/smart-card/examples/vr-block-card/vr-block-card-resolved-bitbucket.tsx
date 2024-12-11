import React from 'react';

import { type JsonLd } from 'json-ld-types';

import { CardClient as Client } from '@atlaskit/link-provider';

import {
	BitbucketBranch,
	BitbucketCommit,
	BitbucketFile1,
	BitbucketProject,
	BitbucketPullRequest1,
	BitbucketRepository1,
} from '../../examples-helpers/_jsonLDExamples';
import VRCardView from '../utils/vr-card-view';

const examples = {
	[BitbucketBranch.data.url]: BitbucketBranch,
	[BitbucketCommit.data.url]: BitbucketCommit,
	[BitbucketFile1.data.url]: BitbucketFile1,
	[BitbucketProject.data.url]: BitbucketProject,
	[BitbucketPullRequest1.data.url]: BitbucketPullRequest1,
	[BitbucketRepository1.data.url]: BitbucketRepository1,
};

class CustomClient extends Client {
	fetchData(url: string) {
		let response = { ...examples[url as keyof typeof examples] };
		return Promise.resolve(response as JsonLd.Response);
	}
}

export const BlockCardBitbucket = () => (
	<div>
		<h4>Branch</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={BitbucketBranch.data.url} />
		<h4>Commit</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={BitbucketCommit.data.url} />
		<h4>File</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={BitbucketFile1.data.url} />
		<h4>Project</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={BitbucketProject.data.url} />
		<h4>Pull request</h4>
		<VRCardView
			appearance="block"
			client={new CustomClient()}
			url={BitbucketPullRequest1.data.url}
		/>
		<h4>Repository</h4>
		<VRCardView
			appearance="block"
			client={new CustomClient()}
			url={BitbucketRepository1.data.url}
		/>
	</div>
);
