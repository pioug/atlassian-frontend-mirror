import React from 'react';

import { MenuGroup, Section } from '@atlaskit/menu';
import { selectField, textField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { TeamsLinkItem } from '../src/ui/TeamsLinkItem';

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

export default function TeamsLinkItemExample() {
	return (
		<Playground config={config}>
			{({ href, intent }) => (
				<MenuGroup>
					<Section title="Navigate">
						<TeamsLinkItem href={href} intent={intent}>
							Teams link item
						</TeamsLinkItem>
					</Section>
				</MenuGroup>
			)}
		</Playground>
	);
}
