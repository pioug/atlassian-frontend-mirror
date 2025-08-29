import React, { type ReactNode } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import GlobeIcon from '@atlaskit/icon/core/globe';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import Image from '@atlaskit/image';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import ConfluenceIcon from '../assets/ConfluenceIcon.svg';
import JiraIcon from '../assets/JiraIcon.svg';
import JiraProjectDiscovery from '../assets/JiraProjectDiscovery.svg';
import JiraServiceManagement from '../assets/JiraServiceManagement.svg';
import LoomIcon from '../assets/LoomIcon.svg';
import { type ContainerSubTypes, type ContainerTypes } from '../types';

interface ContainerProperties {
	description: ReactNode;
	icon: ReactNode;
	title?: ReactNode;
	containerTypeText: ReactNode;
	isEmptyContainer?: boolean;
}

type IconSize = 'small' | 'medium';
const styles = cssMap({
	iconWrapper: {
		width: '12px',
		height: '12px',
	},
	avatarWrapper: {
		width: '24px',
		height: '24px',
	},
	mediumIconWrapper: {
		width: '16px',
		height: '16px',
	},
	globeIconWrapper: {
		width: '16px',
		height: '16px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('border.radius', '3px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
	},
	globeAvatarWrapper: {
		width: '24px',
		height: '24px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('border.radius', '6px'),
	},
});

export const messages = defineMessages({
	addConfluenceContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-title',
		defaultMessage: 'Add space',
		description: 'Title of the card to add a Confluence space to a team',
	},
	addConfluenceSpace: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space',
		defaultMessage: 'Add Confluence Space',
		description: 'Title of the card to add a Confluence space to a team',
	},
	confluenceContainerDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-description',
		defaultMessage: 'Confluence',
		description: 'Description of the card to add a Confluence space to a team',
	},
	addLoomContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-title',
		defaultMessage: 'Add space',
		description: 'Title of the card to add a Loom space to a team',
	},
	addLoomSpace: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space',
		defaultMessage: 'Add Loom Space',
		description: 'Title of the card to add a Loom space to a team',
	},
	confluenceLoomDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-description',
		defaultMessage: 'Loom',
		description: 'Description of the card to add a Loom space to a team',
	},
	addJiraProjectTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project-title',
		defaultMessage: 'Add project',
		description: 'Title of the card to add a Jira project to a team',
	},
	addJiraProject: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project',
		defaultMessage: 'Add Jira Project',
		description: 'Title of the card to add a Jira project to a team',
	},
	jiraProjectDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-jira-project-description',
		defaultMessage: 'Jira',
		description: 'Description of the card to add a Jira project to a team',
	},
	addLoomSpaceTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-title',
		defaultMessage: 'Add space',
		description: 'Title of the card to add a Loom space to a team',
	},
	loomSpaceDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-description',
		defaultMessage: 'Loom',
		description: 'Description of the card to add a Loom space to a team',
	},
	projectContainerText: {
		id: 'ptc-directory.team-profile-page.team-containers.project-container-text',
		defaultMessage: 'project',
		description: 'Text for project type containers',
	},
	spaceContainerText: {
		id: 'ptc-directory.team-profile-page.team-containers.space-container-text',
		defaultMessage: 'space',
		description: 'Text for space type containers',
	},
	emptyWebLinkContainerDescription: {
		id: 'platform.teams.containers.empty-web-link-description',
		defaultMessage: 'Add any web link',
		description: 'Description displayed on the empty card for adding a web link to a team',
	},
	addWebLink: {
		id: 'platform.teams.containers.add-web-link',
		defaultMessage: 'Add Web Link',
		description: 'Title of the card to add a web link to a team',
	},
	webLinkContainerDescription: {
		id: 'platform.teams.containers.web-link-title-description',
		defaultMessage: 'Web link',
		description: 'Description displayed for web link containers in team profile',
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

interface GetJiraContainerPropertiesParams {
	containerTypeProperties?: {
		subType?: ContainerSubTypes;
		name?: string;
	};
	iconSize?: IconSize;
}

const getJiraContainerProperties = ({
	containerTypeProperties,
	iconSize = 'small',
}: GetJiraContainerPropertiesParams): ContainerProperties => {
	const newTeamProfilePage = fg('enable_new_team_profile');
	const { subType, name } = containerTypeProperties || {};
	const baseProperties = {
		description: <FormattedMessage {...messages.jiraProjectDescription} />,
		icon: newTeamProfilePage ? (
			<Flex xcss={styles.avatarWrapper}>
				<Image src={getJiraIcon(subType)} alt="" testId="jira-project-container-icon" />
			</Flex>
		) : (
			<Flex xcss={iconSize === 'medium' ? styles.mediumIconWrapper : styles.iconWrapper}>
				<Image src={getJiraIcon(subType)} alt="" testId="jira-project-container-icon" />
			</Flex>
		),
		title: newTeamProfilePage ? (
			<FormattedMessage {...messages.addJiraProject} />
		) : (
			<FormattedMessage {...messages.addJiraProjectTitle} />
		),
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

interface GetWebLinkContainerPropertiesParams {
	isEmptyContainer?: boolean;
	isDisplayedOnProfileCard?: boolean;
}

const getWebLinkContainerProperties = ({
	isEmptyContainer,
	isDisplayedOnProfileCard,
}: GetWebLinkContainerPropertiesParams) => {
	const newTeamProfilePage = fg('enable_new_team_profile');
	return {
		description: isEmptyContainer ? (
			<Text size="medium" weight="medium">
				<FormattedMessage {...messages.emptyWebLinkContainerDescription} />
			</Text>
		) : (
			<FormattedMessage {...messages.webLinkContainerDescription} />
		),
		icon: isEmptyContainer ? (
			<Box xcss={styles.globeAvatarWrapper} testId="team-link-card-globe-icon">
				<GlobeIcon label="" size="medium" />
			</Box>
		) : isDisplayedOnProfileCard ? (
			<LinkExternalIcon label="" size="small" testId="team-link-card-external-link-icon" />
		) : (
			<Box xcss={styles.globeIconWrapper} testId="team-link-card-globe-icon">
				<GlobeIcon label="" size="small" />
			</Box>
		),
		title: newTeamProfilePage ? <FormattedMessage {...messages.addWebLink} /> : null,
		containerTypeText: null,
	};
};

interface GetContainerPropertiesParams {
	containerType: ContainerTypes;
	iconSize?: IconSize;
	containerTypeProperties?: {
		subType?: ContainerSubTypes;
		name?: string;
	};
	isEmptyContainer?: boolean;
	isDisplayedOnProfileCard?: boolean;
}

export const getContainerProperties = ({
	containerType,
	iconSize = 'small',
	containerTypeProperties,
	isEmptyContainer,
	isDisplayedOnProfileCard,
}: GetContainerPropertiesParams): ContainerProperties => {
	const newTeamProfilePage = fg('enable_new_team_profile');
	switch (containerType) {
		case 'ConfluenceSpace':
			return {
				description: <FormattedMessage {...messages.confluenceContainerDescription} />,
				icon: newTeamProfilePage ? (
					<Flex xcss={styles.avatarWrapper}>
						<Image src={ConfluenceIcon} alt="" testId="confluence-space-container-icon" />
					</Flex>
				) : (
					<Flex xcss={iconSize === 'medium' ? styles.mediumIconWrapper : styles.iconWrapper}>
						<Image src={ConfluenceIcon} alt="" testId="confluence-space-container-icon" />
					</Flex>
				),
				title: newTeamProfilePage ? (
					<FormattedMessage {...messages.addConfluenceSpace} />
				) : (
					<FormattedMessage {...messages.addConfluenceContainerTitle} />
				),
				containerTypeText: <FormattedMessage {...messages.spaceContainerText} />,
			};
		case 'LoomSpace':
			return {
				description: <FormattedMessage {...messages.loomSpaceDescription} />,
				icon: newTeamProfilePage ? (
					<Flex xcss={styles.avatarWrapper}>
						<Image src={LoomIcon} alt="" testId="loom-space-container-icon" />
					</Flex>
				) : (
					<Flex xcss={iconSize === 'medium' ? styles.mediumIconWrapper : styles.iconWrapper}>
						<Image src={LoomIcon} alt="" testId="loom-space-container-icon" />
					</Flex>
				),
				title: newTeamProfilePage ? (
					<FormattedMessage {...messages.addLoomSpace} />
				) : (
					<FormattedMessage {...messages.addLoomContainerTitle} />
				),
				containerTypeText: <FormattedMessage {...messages.spaceContainerText} />,
			};
		case 'JiraProject':
			return getJiraContainerProperties({
				containerTypeProperties,
				iconSize,
			});
		case 'WebLink':
			return getWebLinkContainerProperties({
				isEmptyContainer,
				isDisplayedOnProfileCard,
			});
		default:
			return {
				description: null,
				icon: null,
				title: null,
				containerTypeText: null,
			};
	}
};
