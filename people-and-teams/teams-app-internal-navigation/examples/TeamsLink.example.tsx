import React from 'react';

import { Text } from '@atlaskit/primitives/compiled';
import { selectField, textField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { TeamsLink } from '../src/ui/TeamsLink';

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

export default function TeamsLinkExample() {
	return (
		<Playground config={config}>
			{({ href, intent }) => (
				<Text as="p">
					<TeamsLink href={href} intent={intent}>
						Teams link
					</TeamsLink>
				</Text>
			)}
		</Playground>
	);
}
