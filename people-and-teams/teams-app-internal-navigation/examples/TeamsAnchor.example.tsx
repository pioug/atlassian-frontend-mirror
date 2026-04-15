import React from 'react';

import { Text } from '@atlaskit/primitives/compiled';
import { selectField, textField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { TeamsAnchor } from '../src';

const config = {
	fields: [
		textField({
			id: 'href',
			label: 'href',
			type: 'text',
			defaultValue: '/teams/my-team',
		}),
		selectField({
			id: 'intent',
			label: 'Intent',
			type: 'select',
			defaultValue: 'navigation',
			options: [
				{ label: 'navigation', value: 'navigation' },
				{ label: 'reference', value: 'reference' },
				{ label: 'action', value: 'action' },
				{ label: 'external', value: 'external' },
				{ label: 'unknown', value: 'unknown' },
			],
		}),
	],
} satisfies PlaygroundConfig;

export default function TeamsAnchorExample() {
	return (
		<Playground config={config}>
			{({ href, intent }) => (
				<Text as="p">
					<TeamsAnchor href={href} intent={intent}>
						Teams anchor
					</TeamsAnchor>
				</Text>
			)}
		</Playground>
	);
}
