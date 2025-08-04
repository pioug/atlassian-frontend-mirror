import React, { type ReactNode } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import SpaceIcon from '@atlaskit/icon-lab/core/spaces';
import ProjectIcon from '@atlaskit/icon/core/project';

import { type ContainerTypes } from '../../../../common/types';

interface ContainerProperties {
	description: ReactNode;
	icon: ReactNode;
	title?: ReactNode;
	isEmptyContainer?: boolean;
}

export const getContainerProperties = ({
	containerType,
}: {
	containerType: ContainerTypes;
}): ContainerProperties => {
	switch (containerType) {
		case 'ConfluenceSpace':
			return {
				description: <FormattedMessage {...messages.confluenceContainerDescription} />,
				icon: <SpaceIcon label={'confluence space'} spacing={'spacious'} />,
				title: <FormattedMessage {...messages.addConfluenceContainerTitle} />,
			};
		case 'LoomSpace':
			return {
				description: <FormattedMessage {...messages.loomSpaceDescription} />,
				icon: <SpaceIcon label={'loom space'} spacing={'spacious'} />,
				title: <FormattedMessage {...messages.addLoomContainerTitle} />,
			};
		case 'JiraProject':
			return {
				description: <FormattedMessage {...messages.jiraProjectDescription} />,
				icon: <ProjectIcon label={'jira project'} spacing={'spacious'} />,
				title: <FormattedMessage {...messages.addJiraProjectTitle} />,
			};
		default:
			return {
				description: null,
				icon: null,
				title: null,
			};
	}
};

export const messages = defineMessages({
	addConfluenceContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-title',
		defaultMessage: 'Confluence space',
		description: 'Title of the card to add a Confluence space to a team',
	},
	confluenceContainerDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-description',
		defaultMessage: 'Create a knowledge bank',
		description: 'Description of the card to add a Confluence space to a team',
	},
	addLoomContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-title',
		defaultMessage: 'Loom space',
		description: 'Title of the card to add a Loom space to a team',
	},
	loomSpaceDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-description',
		defaultMessage: 'Share async updates',
		description: 'Description of the card to add a Loom space to a team',
	},
	addJiraProjectTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project-title',
		defaultMessage: 'Jira project',
		description: 'Title of the card to add a Jira project to a team',
	},
	jiraProjectDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project-description',
		defaultMessage: 'Plan out project tasks',
		description: 'Description of the card to add a Jira project to a team',
	},

	emptyWebLinkContainerDescription: {
		id: 'platform.teams.containers.empty-web-link-description',
		defaultMessage: 'Add any web link',
		description: 'Description displayed on the empty card for adding a web link to a team',
	},
	webLinkContainerDescription: {
		id: 'platform.teams.containers.web-link-title-description',
		defaultMessage: 'Web link',
		description: 'Description displayed for web link containers in team profile',
	},
});
