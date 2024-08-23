import React from 'react';
import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives';
import FeatureFlagClient from '../src/index';
import { type ExposureEvent } from '../src/types';

const myAnalyticsHandler = {
	sendOperationalEvent: async (event: ExposureEvent): Promise<void> => {
		console.log('Sending exposure event', event);
	},
};

const client = new FeatureFlagClient({
	analyticsHandler: myAnalyticsHandler,
	flags: {
		'my.experiment': {
			value: 'experiment',
			explanation: {
				kind: 'RULE_MATCH',
				ruleId: '111-bbbbb-ccc',
			},
		},
		'my.boolean.flag': {
			value: false,
		},
		'my.json.flag': {
			value: {
				nav: 'blue',
				footer: 'black',
			},
			explanation: {
				kind: 'RULE_MATCH',
				ruleId: '111-bbbbb-ccc',
			},
		},
		'my.detailed.boolean.flag': {
			value: false,
			explanation: {
				kind: 'RULE_MATCH',
				ruleId: '111-bbbbb-ccc',
			},
		},
	},
});

const JSONFlag: any = client.getJSONValue('my.json.flag');

export default () => (
	<Stack space="space.300">
		<Heading size="large">Feature flag client</Heading>
		<Stack space="space.150">
			<Heading size="small">getVariantValue</Heading>
			<Text as="p">
				Value for flag "my.experiment" is "
				{client.getVariantValue('my.experiment', {
					default: 'control',
					oneOf: ['control', 'experiment'],
				})}
				"
			</Text>
		</Stack>
		<Stack space="space.150">
			<Heading size="small">getBooleanValue</Heading>
			<Text as="p">
				Value for flag "my.boolean.flag" is "
				{JSON.stringify(client.getBooleanValue('my.boolean.flag', { default: true }))}"
			</Text>
		</Stack>
		<Stack space="space.150">
			<Heading size="small">getJSONFlag</Heading>
			<Text as="p">Nav color is {JSONFlag.nav}</Text>
			<Text as="p">Footer color is {JSONFlag.footer}</Text>
		</Stack>
	</Stack>
);
