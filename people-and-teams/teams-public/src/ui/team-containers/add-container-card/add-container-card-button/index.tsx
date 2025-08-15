import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { Flex, Stack, Text } from '@atlaskit/primitives/compiled';

import type { ContainerTypes } from '../../../../common/types';

function AddContainerCardButton({ type }: { type: ContainerTypes }) {
	const { title, description } = getContainerProperties(type);
	return (
		<Stack>
			<Text maxLines={1} weight="medium" color="color.text">
				{title}
			</Text>
			<Flex gap="space.050" alignItems="center">
				<Text size="small" color="color.text.subtle">
					{description}
				</Text>
			</Flex>
		</Stack>
	);
}

function getContainerProperties(type: ContainerTypes) {
	switch (type) {
		case 'ConfluenceSpace':
			return {
				description: <FormattedMessage {...messages.confluenceContainerDescription} />,
				title: <FormattedMessage {...messages.addConfluenceContainerTitle} />,
			};
		case 'LoomSpace':
			return {
				description: <FormattedMessage {...messages.loomSpaceDescription} />,
				title: <FormattedMessage {...messages.addLoomContainerTitle} />,
			};
		case 'JiraProject':
			return {
				description: <FormattedMessage {...messages.jiraProjectDescription} />,
				title: <FormattedMessage {...messages.addJiraProjectTitle} />,
			};
		case 'WebLink':
			return {
				description: null,
				title: <FormattedMessage {...messages.addWebLinkTitle} />,
			};
		default:
			return { description: null, title: null };
	}
}

const messages = defineMessages({
	addConfluenceContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.create.add-confluence-space-title',
		defaultMessage: 'Confluence space',
		description: 'Title of the card to add a Confluence space to a team',
	},
	confluenceContainerDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.create.add-confluence-space-description',
		defaultMessage: 'Create a knowledge bank',
		description: 'Description of the card to add a Confluence space to a team',
	},
	addLoomContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.create.add-loom-space-title',
		defaultMessage: 'Loom space',
		description: 'Title of the card to add a Loom space to a team',
	},
	loomSpaceDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.create.add-loom-space-description',
		defaultMessage: 'Share async updates',
		description: 'Description of the card to add a Loom space to a team',
	},
	addJiraProjectTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.create.add-jira-project-title',
		defaultMessage: 'Jira project',
		description: 'Title of the card to add a Jira project to a team',
	},
	jiraProjectDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.create.add-jira-project-description',
		defaultMessage: 'Plan out project tasks',
		description: 'Description of the card to add a Jira project to a team',
	},
	addWebLinkTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.create.add-web-link-title',
		defaultMessage: 'Add any web link',
		description: 'Title of the card to add a any web link to a team',
	},
});

export { AddContainerCardButton };
