import React, { type ReactNode } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import Image from '@atlaskit/image';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Text } from '@atlaskit/primitives/compiled';

import ConfluenceIcon from '../assets/ConfluenceIcon.svg';
import JiraIcon from '../assets/JiraIcon.svg';
import JiraProjectDiscovery from '../assets/JiraProjectDiscovery.svg';
import JiraServiceManagement from '../assets/JiraServiceManagement.svg';
import { type ContainerSubTypes, type ContainerTypes } from '../types';

interface ContainerProperties {
	description: ReactNode;
	icon: ReactNode;
	title?: ReactNode;
	containerTypeText: ReactNode;
}

type IconSize = 'small' | 'medium';
const styles = cssMap({
	iconWrapper: {
		width: '12px',
		height: '12px',
	},
	mediumIconWrapper: {
		width: '16px',
		height: '16px',
	},
});

export const messages = defineMessages({
	addConfluenceContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-title.non-final',
		defaultMessage: 'Add space',
		description: 'Title of the card to add a Confluence space to a team',
	},
	confluenceContainerDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-description.non-final',
		defaultMessage: 'Confluence',
		description: 'Description of the card to add a Confluence space to a team',
	},
	addJiraProjectTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project-title.non-final',
		defaultMessage: 'Add project',
		description: 'Title of the card to add a Jira project to a team',
	},
	jiraProjectDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project-description.non-final',
		defaultMessage: 'Jira',
		description: 'Description of the card to add a Jira project to a team',
	},
	addLoomSpaceTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-title.non-final',
		defaultMessage: 'Add space',
		description: 'Title of the card to add a Loom space to a team',
	},
	loomSpaceDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-description.non-final',
		defaultMessage: 'Loom',
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
	webLinkContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.webLink-container-text.non-final',
		defaultMessage: 'Add any web link',
		description: 'Description of the card to add a web link to a team',
	},
});

const getJiraIcon = (containerSubTypes?: string) => {
	switch (containerSubTypes) {
		case 'PRODUCT_DISCOVERY':
			return JiraProjectDiscovery;
		case 'SERVICE_DESK':
			return JiraServiceManagement;
		default:
			return JiraIcon;
	}
};

const getJiraContainerProperties = (containerTypeProperties?: {
	subType?: ContainerSubTypes;
	name?: string;
}): ContainerProperties => {
	const { subType, name } = containerTypeProperties || {};
	const Comp = fg('enable_card_alignment_fix') ? Flex : Box;
	const baseProperties = {
		description: <FormattedMessage {...messages.jiraProjectDescription} />,
		icon: (
			<Comp xcss={styles.iconWrapper}>
				<Image src={getJiraIcon(subType)} alt="" testId="jira-project-container-icon" />
			</Comp>
		),
		title: <FormattedMessage {...messages.addJiraProjectTitle} />,
		containerTypeText: <FormattedMessage {...messages.projectContainerText} />,
	};

	switch (subType) {
		case 'PRODUCT_DISCOVERY':
		case 'SERVICE_DESK':
			return {
				...baseProperties,
				containerTypeText: '',
				description: name || baseProperties.description,
			};
		default:
			return baseProperties;
	}
};

export const getContainerProperties = (
	containerType: ContainerTypes,
	iconSize: IconSize = 'small',
	containerTypeProperties?: {
		subType?: ContainerSubTypes;
		name?: string;
	},
): ContainerProperties => {
	const Comp = fg('enable_card_alignment_fix') ? Flex : Box;
	switch (containerType) {
		case 'ConfluenceSpace':
			return {
				description: <FormattedMessage {...messages.confluenceContainerDescription} />,
				icon: (
					<Comp xcss={iconSize === 'medium' ? styles.mediumIconWrapper : styles.iconWrapper}>
						<Image src={ConfluenceIcon} alt="" testId="confluence-space-container-icon" />
					</Comp>
				),
				title: <FormattedMessage {...messages.addConfluenceContainerTitle} />,
				containerTypeText: <FormattedMessage {...messages.spaceContainerText} />,
			};
		case 'JiraProject':
			return getJiraContainerProperties(containerTypeProperties);
		case 'WebLink':
			return {
				description: (
					<Text size="medium" weight="medium">
						<FormattedMessage {...messages.webLinkContainerTitle} />
					</Text>
				),
				icon: null,
				title: null,
				containerTypeText: null,
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
