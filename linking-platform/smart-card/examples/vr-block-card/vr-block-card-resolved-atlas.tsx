import React from 'react';

import { type JsonLd } from 'json-ld-types';

import { CardClient as Client } from '@atlaskit/link-provider';

import { AtlasGoal, AtlasProject } from '../../examples-helpers/_jsonLDExamples';
import VRCardView from '../utils/vr-card-view';

const examples = {
	[AtlasProject.data.url]: AtlasProject,
	[AtlasGoal.data.url]: AtlasGoal,
};

class CustomClient extends Client {
	fetchData(url: string) {
		let response = { ...examples[url as keyof typeof examples] };
		return Promise.resolve(response as JsonLd.Response);
	}
}

export const BlockCardAtlas = () => (
	<div>
		<h4>Project</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={AtlasProject.data.url} />
		<h4>AtlasGoal</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={AtlasProject.data.url} />
	</div>
);
