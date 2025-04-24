import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { Inline, Text } from '@atlaskit/primitives/compiled';

import { LoadingCardLink } from '../../src/view/CardWithUrl/component-lazy/LoadingCardLink';
import { ResolvedClient } from '../utils/custom-client';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Inline alignBlock="center" space="space.100">
			<Text>Default (url): </Text>
			<LoadingCardLink appearance="inline" id="" url="http://some.url" />
		</Inline>
		<Inline alignBlock="center" space="space.100">
			<Text>With placeholder: </Text>
			<LoadingCardLink
				appearance="inline"
				id=""
				placeholder="This is a fancy placeholder text."
				url="http://some.url"
			/>
		</Inline>
	</SmartCardProvider>
);
