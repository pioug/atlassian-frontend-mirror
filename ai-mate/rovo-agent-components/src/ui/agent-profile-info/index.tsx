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
import { type AgentCreatorType, isForgeAgentByCreatorType } from '../agent-avatar';

import { messages } from './messages';

const styles = cssMap({
	clickableItem: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
	},

	rovoIconWrapper: {
		display: 'flex',
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
	descriptionRefresh: {
		marginBlock: token('space.0'),
		overflowWrap: 'anywhere',
		wordBreak: 'break-word',
	},

	wrapper: {
		marginBottom: token('space.100'),
	},

	headingWrapper: {
		position: 'relative',
	},

	hiddenIconWrapper: {
		marginTop: token('space.025'),
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

	if (
		fg('rovo_agent_support_a2a_avatar')
			? isForgeAgentByCreatorType(creatorType as AgentCreatorType)
			: creatorType === 'FORGE' || creatorType === 'THIRD_PARTY' // THIRD_PARTY is deprecated in convo-ai, use FORGE instead
	) {
		return { type: 'FORGE' as const, name: forgeCreator ?? '' };
	}

	if (creatorType === 'OOTB') {
		return { type: 'OOTB' as const };
	}

	if (creatorType === 'CUSTOMER') {
		if (authoringTeam) {
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
			<Box xcss={styles.rovoIconWrapper} testId="rovo-icon-wrapper" aria-hidden="true">
				<RovoIcon appearance="brand" size="small" />
			</Box>
			{creatorRender}
		</Box>
	) : null;
};

export const AgentProfileInfo = ({
	agentName,
	agentDescription,
	creatorRender,
	starCountRender,
	headingRender,
	isStarred,
	isHidden,
	onStarToggle,
	showStarButton = true,
}: {
	agentName: string;
	agentDescription?: string | null;
	creatorRender: React.ReactNode;
	starCountRender: React.ReactNode;
	headingRender?: React.ReactNode;
	isStarred: boolean;
	isHidden: boolean;
	onStarToggle: () => void;
	showStarButton?: boolean;
}) => {
	const { formatMessage } = useIntl();
	return (
		<Stack space="space.100" xcss={fg('rovo_agent_empty_state_refresh') ? null : styles.wrapper}>
			<Inline xcss={styles.name} space="space.100" alignBlock="center">
				<Inline space="space.075" xcss={styles.headingWrapper}>
					<Heading as="h2" size={fg('rovo_agent_empty_state_refresh') ? 'medium' : 'xlarge'}>
						{agentName}
					</Heading>
					{headingRender}
					{isHidden && (
						<Box xcss={styles.hiddenIconWrapper}>
							<Tooltip content={formatMessage(messages.hiddenTooltip)} position="top">
								<HiddenIcon label={formatMessage(messages.hiddenIcon)} />
							</Tooltip>
						</Box>
					)}
				</Inline>
				{showStarButton && <StarIconButton isStarred={isStarred} handleToggle={onStarToggle} />}
			</Inline>
			{creatorRender}
			{!!agentDescription && (
				<Box
					xcss={
						fg('rovo_agent_empty_state_refresh') ? styles.descriptionRefresh : styles.description
					}
					as="p"
				>
					{agentDescription}
				</Box>
			)}
			{starCountRender}
		</Stack>
	);
};
