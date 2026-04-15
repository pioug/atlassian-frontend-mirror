import React from 'react';

import { selectField, textField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { TeamsLinkButton } from '../src/ui/TeamsLinkButton';

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
		selectField({
			id: 'appearance',
			label: 'Appearance',
			type: 'select',
			defaultValue: 'default',
			options: [
				{ label: 'default', value: 'default' },
				{ label: 'primary', value: 'primary' },
				{ label: 'subtle', value: 'subtle' },
				{ label: 'warning', value: 'warning' },
				{ label: 'danger', value: 'danger' },
			],
		}),
	],
} satisfies PlaygroundConfig;

export default function TeamsLinkButtonExample() {
	return (
		<Playground config={config}>
			{({ href, intent, appearance }) => (
				<TeamsLinkButton href={href} intent={intent} appearance={appearance}>
					Teams link button
				</TeamsLinkButton>
			)}
		</Playground>
	);
}
