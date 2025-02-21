import React, { type ReactNode } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';

import { type ContainerTypes } from '../types';

interface ContainerProperties {
	description: ReactNode;
	icon: ReactNode;
	title?: ReactNode;
	containerTypeText: ReactNode;
}

export const messages = defineMessages({
	addConfluenceContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-title.non-final',
		defaultMessage: 'Add Confluence space',
		description: 'Title of the card to add a Confluence space to a team',
	},
	confluenceContainerDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-description.non-final',
		defaultMessage: 'Confluence space',
		description: 'Description of the card to add a Confluence space to a team',
	},
	addJiraProjectTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project-title.non-final',
		defaultMessage: 'Add Jira project',
		description: 'Title of the card to add a Jira project to a team',
	},
	jiraProjectDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project-description.non-final',
		defaultMessage: 'Jira project',
		description: 'Description of the card to add a Jira project to a team',
	},
	addLoomSpaceTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-title.non-final',
		defaultMessage: 'Add Loom space',
		description: 'Title of the card to add a Loom space to a team',
	},
	loomSpaceDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-description.non-final',
		defaultMessage: 'Loom space',
		description: 'Description of the card to add a Loom space to a team',
	},
	projectContainerText: {
		id: 'ptc-directory.team-profile-page.team-containers.project-container-text.non-final',
		defaultMessage: 'project',
		description: 'Text for project type containers',
	},
	spaceContainerText: {
		id: 'ptc-directory.team-profile-page.team-containers.space-container-text.non-final',
		defaultMessage: 'space',
		description: 'Text for space type containers',
	},
});

export const getContainerProperties = (containerType: ContainerTypes): ContainerProperties => {
	switch (containerType) {
		case 'ConfluenceSpace':
			return {
				description: <FormattedMessage {...messages.confluenceContainerDescription} />,
				icon: <ConfluenceIcon appearance="brand" label="" size="xsmall" />,
				title: <FormattedMessage {...messages.addConfluenceContainerTitle} />,
				containerTypeText: <FormattedMessage {...messages.spaceContainerText} />,
			};
		case 'JiraProject':
			return {
				description: <FormattedMessage {...messages.jiraProjectDescription} />,
				icon: <JiraIcon appearance="brand" label="" size="xsmall" />,
				title: <FormattedMessage {...messages.addJiraProjectTitle} />,
				containerTypeText: <FormattedMessage {...messages.projectContainerText} />,
			};
		default:
			return {
				description: null,
				icon: null,
				title: null,
				containerTypeText: null,
			};
	}
};
