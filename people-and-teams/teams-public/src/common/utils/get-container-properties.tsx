import React, { type ReactNode } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { cssMap, cx } from '@atlaskit/css';
import LinkIcon from '@atlaskit/icon/core/link';
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
	avatarWrapper: {
		width: '24px',
		height: '24px',
	},
	avatarMargin: {
		marginTop: token('space.025', '2px'),
		marginRight: token('space.025', '2px'),
		marginBottom: token('space.025', '2px'),
		marginLeft: token('space.025', '2px'),
	},
	smallAvatarWrapper: {
		width: '16px',
		height: '16px',
	},
	smallAvatarMargin: {
		marginInline: 0,
		marginBlock: 0,
	},
	linkIconWrapper: {
		width: '16px',
		height: '16px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('radius.small', '3px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
	},
	linkAvatarWrapper: {
		width: '24px',
		height: '24px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small', '6px'),
	},
});

export const messages = defineMessages({
	addConfluenceContainerTitle: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-title',
		defaultMessage: 'Add space',
		description: 'Title of the card to add a Confluence space to a team',
	},
	confluenceContainerDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-confluence-space-description',
		defaultMessage: 'Confluence',
		description: 'Description of the card to add a Confluence space to a team',
	},
	addLoomSpace: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space',
		defaultMessage: 'Add Loom Space',
		description: 'Title of the card to add a Loom space to a team',
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
	loomSpaceDescription: {
		id: 'ptc-directory.team-profile-page.team-containers.add-loom-space-description',
		defaultMessage: 'Loom',
		description: 'Description of the card to add a Loom space to a team',
	},
	spaceContainerTextOverride: {
		id: 'ptc-directory.team-profile-page.team-containers.space-container-text-override',
		defaultMessage: 'Space',
		description: 'Text for space type containers',
	},
	emptyLinkContainerDescription: {
		id: 'platform.teams.containers.empty-link-description',
		defaultMessage: 'Add any link',
		description: 'Description displayed on the empty card for adding a link to a team',
	},
	addLink: {
		id: 'platform.teams.containers.add-link',
		defaultMessage: 'Add Link',
		description: 'Title of the card to add a link to a team',
	},
	linkContainerDescription: {
		id: 'platform.teams.containers.link-title-description',
		defaultMessage: 'Link',
		description: 'Description displayed for link containers in team profile',
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
	iconSize = fg('ptc-fix-containers-after-icon-size') ? 'medium' : 'small',
}: GetJiraContainerPropertiesParams): ContainerProperties => {
	const { subType, name } = containerTypeProperties || {};
	const isAfterIconSizeFixEnabled = fg('ptc-fix-containers-after-icon-size');
	const baseProperties = {
		description: <FormattedMessage {...messages.jiraProjectDescription} />,
		icon: (
			<Flex
				xcss={cx(
					iconSize === 'small' && isAfterIconSizeFixEnabled
						? styles.smallAvatarWrapper
						: styles.avatarWrapper,
					iconSize === 'small' && isAfterIconSizeFixEnabled
						? styles.smallAvatarMargin
						: styles.avatarMargin,
				)}
			>
				<Image src={getJiraIcon(subType)} alt="" testId="jira-project-container-icon" />
			</Flex>
		),
		title: <FormattedMessage {...messages.addJiraProject} />,
		containerTypeText: <FormattedMessage {...messages.spaceContainerTextOverride} />,
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
	return {
		description: isEmptyContainer ? (
			<Text size="medium" weight="medium">
				<FormattedMessage {...messages.emptyLinkContainerDescription} />
			</Text>
		) : (
			<FormattedMessage {...messages.linkContainerDescription} />
		),
		icon: isEmptyContainer ? (
			<Box
				xcss={cx(styles.linkAvatarWrapper, styles.avatarMargin)}
				testId="team-link-card-globe-icon"
			>
				<LinkIcon label="" size="medium" />
			</Box>
		) : isDisplayedOnProfileCard ? (
			<LinkExternalIcon label="" size="small" testId="team-link-card-external-link-icon" />
		) : (
			<Box xcss={styles.linkIconWrapper} testId="team-link-card-globe-icon">
				<LinkIcon label="" size="small" />
			</Box>
		),
		title: <FormattedMessage {...messages.addLink} />,
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
	iconSize = fg('ptc-fix-containers-after-icon-size') ? 'medium' : 'small',
	containerTypeProperties,
	isEmptyContainer,
	isDisplayedOnProfileCard,
}: GetContainerPropertiesParams): ContainerProperties => {
	const isAfterIconSizeFixEnabled = fg('ptc-fix-containers-after-icon-size');
	switch (containerType) {
		case 'ConfluenceSpace':
			return {
				description: <FormattedMessage {...messages.confluenceContainerDescription} />,
				icon: (
					<Flex
						xcss={cx(
							iconSize === 'small' && isAfterIconSizeFixEnabled
								? styles.smallAvatarWrapper
								: styles.avatarWrapper,
							iconSize === 'small' && isAfterIconSizeFixEnabled
								? styles.smallAvatarMargin
								: styles.avatarMargin,
						)}
					>
						<Image src={ConfluenceIcon} alt="" testId="confluence-space-container-icon" />
					</Flex>
				),
				title: <FormattedMessage {...messages.addConfluenceContainerTitle} />,
				containerTypeText: <FormattedMessage {...messages.spaceContainerTextOverride} />,
			};
		case 'LoomSpace':
			return {
				description: <FormattedMessage {...messages.loomSpaceDescription} />,
				icon: (
					<Flex
						xcss={cx(
							iconSize === 'small' && isAfterIconSizeFixEnabled
								? styles.smallAvatarWrapper
								: styles.avatarWrapper,
							iconSize === 'small' && isAfterIconSizeFixEnabled
								? styles.smallAvatarMargin
								: styles.avatarMargin,
						)}
					>
						<Image src={LoomIcon} alt="" testId="loom-space-container-icon" />
					</Flex>
				),
				title: <FormattedMessage {...messages.addLoomSpace} />,
				containerTypeText: <FormattedMessage {...messages.spaceContainerTextOverride} />,
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
