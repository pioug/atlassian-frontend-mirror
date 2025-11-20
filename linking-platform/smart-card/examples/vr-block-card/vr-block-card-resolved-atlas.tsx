import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client } from '@atlaskit/link-provider';
import { AtlasGoal, AtlasProject } from '@atlaskit/link-test-helpers';

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

export const BlockCardAtlas = (): React.JSX.Element => (
	<div>
		<h4>Project</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={AtlasProject.data.url} />
		<h4>AtlasGoal</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={AtlasGoal.data.url} />
	</div>
);
