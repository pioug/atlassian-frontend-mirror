import React from 'react';

import Heading from '@atlaskit/heading';
import IdeaObject from '@atlaskit/object/idea';
import PullRequestObject from '@atlaskit/object/pull-request';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

export default function ObjectLabelling() {
	return (
		<Stack space="space.200">
			<Heading size="medium">Non-decorative object with a label</Heading>
			<IdeaObject label="Idea" />
			<Heading size="medium">Decorative object without a label</Heading>
			<Inline space="space.100" alignBlock="center">
				{/* This object is already described by accompanying text, so no label is needed */}
				<PullRequestObject label="" />
				<Heading size="small">Pull request</Heading>
			</Inline>
		</Stack>
	);
}
