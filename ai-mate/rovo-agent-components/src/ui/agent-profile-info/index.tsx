/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import { AtlassianIcon, RovoIcon } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { HiddenIcon } from '../../common/ui/hidden-icon';
import { StarIconButton } from '../../common/ui/star-icon-button';

import { messages } from './messages';

const styles = cssMap({
	clickableItem: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
	},

	name: {
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},

	description: {
		marginTop: token('space.0'),
		marginBottom: token('space.100'),
		overflowWrap: 'anywhere',
		wordBreak: 'break-word',
	},

	wrapper: {
		marginBottom: token('space.100'),
	},

	tooltipWrapper: {
		display: 'inline-flex',
		marginInline: token('space.100'),
		position: 'relative',
		bottom: token('space.025'),
	},

	headingWrapper: {
		position: 'relative',
	},
});

type AgentCreator =
	| {
			type: 'CUSTOMER';
			name: string;
			profileLink: string;
			status?: 'active' | 'inactive' | 'closed' | string;
	  }
	| {
			type: 'SYSTEM';
	  }
	| {
			// THIRD_PARTY is deprecated in convo-ai, use FORGE instead
			type: 'THIRD_PARTY' | 'FORGE';
			name: string;
	  }
	| {
			type: 'OOTB';
	  };

export const getAgentCreator = ({
	creatorType,
	authoringTeam,
	userCreator,
	forgeCreator,
}: {
	creatorType: string;
	authoringTeam?: { displayName: string; profileLink?: string };
	userCreator?: { name: string; status?: string; profileLink?: string };
	forgeCreator?: string;
}): AgentCreator | undefined => {
	if (creatorType === 'SYSTEM') {
		return { type: 'SYSTEM' as const };
	}

	// THIRD_PARTY is deprecated in convo-ai, use FORGE instead
	if (creatorType === 'FORGE' || creatorType === 'THIRD_PARTY') {
		return { type: 'FORGE' as const, name: forgeCreator ?? '' };
	}

	if (creatorType === 'OOTB') {
		return { type: 'OOTB' as const };
	}

	if (creatorType === 'CUSTOMER') {
		if (authoringTeam && fg('agent_studio_permissions_settings_m3_profiles')) {
			return {
				type: 'CUSTOMER' as const,
				name: authoringTeam.displayName,
				profileLink: authoringTeam.profileLink ?? '',
			};
		}

		if (!userCreator?.profileLink) {
			return undefined;
		}

		return {
			type: 'CUSTOMER' as const,
			name: userCreator.name,
			profileLink: userCreator.profileLink,
			status: userCreator.status,
		};
	}
	return;
};

export const AgentProfileCreator = ({
	creator,
	onCreatorLinkClick,
	isLoading,
}: {
	/**
	 * Get this value from `getAgentCreator`
	 */
	creator?: AgentCreator;
	isLoading: boolean;
	onCreatorLinkClick: () => void;
}) => {
	const { formatMessage } = useIntl();

	const getCreatorRender = () => {
		if (isLoading) {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: (
					<Skeleton
						testId="agent-profile-creator-skeleton"
						isShimmering
						height={18}
						width={100}
						borderRadius={3}
					/>
				),
			});
		}

		if (!creator) {
			return null;
		}

		if (creator.type === 'SYSTEM' || creator.type === 'OOTB') {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: (
					<Inline alignBlock="center" testId="atlassian-icon">
						<AtlassianIcon label="" size="small" appearance="brand" />
						<Box>Atlassian</Box>
					</Inline>
				),
			});
		}

		if (creator.type === 'CUSTOMER') {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: fg('dst-a11y__replace-anchor-with-link__ai-mate') ? (
					<Link href={creator.profileLink} onClick={() => onCreatorLinkClick()} target="_blank">
						{creator.name}{' '}
						{creator.status === 'inactive' && formatMessage(messages.agentDeactivated)}
					</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a href={creator.profileLink} onClick={() => onCreatorLinkClick()} target="_blank">
						{creator.name}{' '}
						{creator.status === 'inactive' && formatMessage(messages.agentDeactivated)}
					</a>
				),
			});
		}

		// THIRD_PARTY is deprecated in convo-ai, use FORGE instead
		if (creator.type === 'THIRD_PARTY' || creator.type === 'FORGE') {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: creator.name,
			});
		}

		return null;
	};

	const creatorRender = getCreatorRender();

	return creatorRender ? (
		<Box xcss={styles.clickableItem}>
			<RovoIcon appearance="brand" size="small" />
			{creatorRender}
		</Box>
	) : null;
};

export const AgentProfileInfo = ({
	agentName,
	agentDescription,
	creatorRender,
	starCountRender,
	isStarred,
	isHidden,
	onStarToggle,
}: {
	agentName: string;
	agentDescription?: string | null;
	creatorRender: React.ReactNode;
	starCountRender: React.ReactNode;
	isStarred: boolean;
	isHidden: boolean;
	onStarToggle: () => void;
}) => {
	const { formatMessage } = useIntl();
	return (
		<Stack space="space.100" xcss={styles.wrapper}>
			<Inline xcss={styles.name} space="space.100" alignBlock="center">
				<Inline xcss={styles.headingWrapper} alignBlock="end">
					<Heading as="h2" size="xlarge">
						{agentName}
					</Heading>
					{isHidden && (
						<Box xcss={styles.tooltipWrapper}>
							<Tooltip content={formatMessage(messages.hiddenTooltip)} position="top">
								<HiddenIcon label={formatMessage(messages.hiddenIcon)} />
							</Tooltip>
						</Box>
					)}
				</Inline>
				<StarIconButton isStarred={isStarred} handleToggle={onStarToggle} />
			</Inline>
			{creatorRender}
			{!!agentDescription && (
				<Box xcss={styles.description} as="p">
					{agentDescription}
				</Box>
			)}
			{starCountRender}
		</Stack>
	);
};
