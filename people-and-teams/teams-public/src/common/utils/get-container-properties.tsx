import React, { type ReactNode } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { ConfluenceIcon, JiraIcon, LoomIcon } from '@atlaskit/logo';

import { type ContainerTypes } from '../types';

interface ContainerProperties {
	description: ReactNode;
	icon: ReactNode;
	title?: ReactNode;
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
});

export const getContainerProperties = (containerType: ContainerTypes): ContainerProperties => {
	switch (containerType) {
		case 'confluence':
			return {
				description: <FormattedMessage {...messages.confluenceContainerDescription} />,
				icon: <ConfluenceIcon appearance="brand" label="" size="xsmall" />,
				title: <FormattedMessage {...messages.addConfluenceContainerTitle} />,
			};
		case 'jira':
			return {
				description: <FormattedMessage {...messages.jiraProjectDescription} />,
				icon: <JiraIcon appearance="brand" label="" size="xsmall" />,
				title: <FormattedMessage {...messages.addJiraProjectTitle} />,
			};
		case 'loom':
			return {
				description: <FormattedMessage {...messages.loomSpaceDescription} />,
				icon: <LoomIcon appearance="brand" label="" size="xsmall" />,
				title: <FormattedMessage {...messages.addLoomSpaceTitle} />,
			};
		default:
			return {
				description: null,
				icon: null,
				title: null,
			};
	}
};
