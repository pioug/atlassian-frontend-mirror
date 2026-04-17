import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { selectField, toggleField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';


import { TeamLinkCard } from '../src';

const styles = cssMap({
	wrapper: {
		width: '480px',
	},
});

const config = {
	fields: [
		selectField({
			id: 'containerType',
			label: 'Container type',
			type: 'select',
			defaultValue: 'JiraProject',
			group: 'Props',
			options: [
				{ value: 'JiraProject', label: 'Jira Project' },
				{ value: 'ConfluenceSpace', label: 'Confluence Space' },
				{ value: 'LoomSpace', label: 'Loom Space' },
				{ value: 'WebLink', label: 'Web Link' },
			],
		}),
		toggleField({
			id: 'isReadOnly',
			label: 'Read only',
			type: 'toggle',
			defaultValue: false,
			group: 'Props',
		}),
	],
} satisfies PlaygroundConfig;

export default function Example(): React.JSX.Element {
	return (
		<Playground config={config}>
			{({ containerType, isReadOnly }) => (
				<Box xcss={styles.wrapper}>
					<Stack space="space.100">
						<TeamLinkCard
							containerType={containerType}
							title="My team's Jira project"
							containerId="container-id"
							link="https://example.atlassian.net/jira/software/projects/DEMO/boards"
							containerIcon="https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/default-avatar.png"
							onDisconnectButtonClick={() => {}}
							onEditLinkClick={() => {}}
							isReadOnly={isReadOnly}
						/>
						<TeamLinkCard
							containerType="WebLink"
							title="Team documentation site"
							containerId="web-link-id"
							link="https://docs.example.com"
							onDisconnectButtonClick={() => {}}
							onEditLinkClick={() => {}}
							isReadOnly={isReadOnly}
						/>
					</Stack>
				</Box>
			)}
		</Playground>
	);
}
