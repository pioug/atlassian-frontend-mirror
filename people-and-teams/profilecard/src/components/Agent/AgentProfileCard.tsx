import React, { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import InformationCircleIcon from '@atlaskit/icon/core/information-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import type { AgentCreatorType } from '@atlaskit/rovo-agent-components/common/types';
import { isForgeAgentByCreatorType } from '@atlaskit/rovo-agent-components/common/utils/is-forge-agent';
import { AgentBanner } from '@atlaskit/rovo-agent-components/ui/agent-avatar/GeneratedAvatar';
import { AgentAvatar } from '@atlaskit/rovo-agent-components/ui/AgentAvatar';
import { type ConversationStarter } from '@atlaskit/rovo-agent-components/ui/AgentConversationStarters';
import {
	AgentProfileCreator,
	AgentProfileInfo,
} from '@atlaskit/rovo-agent-components/ui/AgentProfileInfo';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import { TeamsLink } from '@atlaskit/teams-app-internal-navigation/teams-link';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { type AgentProfileCardProps } from '../../types';
import { PACKAGE_META_DATA } from '../../util/analytics';
import { getPageTime } from '../../util/performance';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../Error';

import { AgentActions } from './Actions';
import { AgentProfileCardWrapper } from './AgentProfileCardWrapper';
import { ConversationStarters } from './ConversationStarters';
import { useAgentUrlActions } from './hooks/useAgentActions';
import { messages } from './messages';

const styles = cssMap({
	detailWrapper: {
		paddingBlockStart: token('space.300'),
	},
	avatarStyles: {
		position: 'absolute',
		top: token('space.300'),
		left: token('space.200'),
	},
	cardContainerStyles: {
		borderRadius: token('radius.large'),
		position: 'relative',
		overflow: 'hidden',
	},
	cardContainerStylesLegacy: {
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
		position: 'relative',
		overflow: 'hidden',
	},
	agentProfileInfoWrapper: {
		paddingInline: token('space.200'),
	},
	descriptionWrapper: {
		paddingInline: token('space.200'),
	},
	description: {
		marginBlock: token('space.0'),
		overflowWrap: 'anywhere',
		wordBreak: 'break-word',
	},
	conversationStartersWrapper: {
		paddingInline: token('space.150'),
	},
	disclosureWrapper: {
		paddingInline: token('space.200'),
		gap: token('space.050'),
	},
	// Legacy block padding.
	disclosureWrapperLegacy: {
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInline: token('space.200'),
		gap: token('space.050'),
	},
});

const AgentProfileCard = ({
	agent,
	isLoading,
	cloudId,
	email,
	onChatClick,
	hasError,
	errorType,
	onConversationStartersClick,
	resourceClient,
	addFlag,
	onDeleteAgent,
	hideMoreActions,
	hideAiDisclaimer = false,
	hideConversationStarters = false,
	hideAgentActions = false,
	hideStarButton = false,
}: AgentProfileCardProps): React.JSX.Element => {
	const {
		onEditAgent,
		onCopyAgent,
		onDuplicateAgent,
		onOpenChat: onOpenChatFullScreen,
		onConversationStarter,
		onViewFullProfile,
	} = useAgentUrlActions({
		cloudId: cloudId || '',
		email,
		source: 'agentProfileCard',
	});

	const [isStarred, setIsStarred] = useState(false);
	const [starCount, setStarCount] = useState<number | undefined>();
	const { formatMessage } = useIntl();
	const { fireEvent } = useAnalyticsEventsNext();

	const userDefinedConversationStarters: ConversationStarter[] | undefined =
		agent?.user_defined_conversation_starters?.map((starter) => {
			return {
				message: starter,
				type: 'user-defined',
			};
		});

	useEffect(() => {
		setIsStarred(!!agent?.favourite);
		setStarCount(agent?.favourite_count);
	}, [agent?.favourite, agent?.favourite_count]);

	const handleSetFavourite = useCallback(async () => {
		if (agent?.id) {
			try {
				await resourceClient.setFavouriteAgent(agent.id, !isStarred, fireEvent);
				if (isStarred) {
					setStarCount(starCount ? starCount - 1 : 0);
				} else {
					setStarCount((starCount || 0) + 1);
				}
				setIsStarred(!isStarred);
			} catch {}
		}
	}, [agent?.id, fireEvent, isStarred, resourceClient, starCount]);

	const handleOnDelete = useCallback(async () => {
		if (agent && onDeleteAgent) {
			// Optimistically remove from cache
			const { restore } = onDeleteAgent(agent.id);

			try {
				await resourceClient.deleteAgent(agent.id, fireEvent);

				addFlag?.({
					title: formatMessage(messages.agentDeletedSuccessFlagTitle),
					description: formatMessage(messages.agentDeletedSuccessFlagDescription, {
						agentName: agent.name,
					}),
					type: 'success',
					id: 'ptc-directory.agent-profile.delete-agent-success',
				});
			} catch {
				// Restore agent to cache on error
				restore();

				addFlag?.({
					title: formatMessage(messages.agentDeletedErrorFlagTitle),
					description: formatMessage(messages.agentDeletedErrorFlagDescription),
					type: 'error',
					id: 'ptc-directory.agent-profile.delete-agent-error',
				});
			}
		}
	}, [addFlag, agent, formatMessage, onDeleteAgent, resourceClient, fireEvent]);

	useEffect(() => {
		if (!isLoading && agent) {
			fireEvent(`ui.rovoAgentProfilecard.rendered.content`, {
				...PACKAGE_META_DATA,
				firedAt: Math.round(getPageTime()),
			});
		}
	}, [agent, fireEvent, isLoading]);

	if (isLoading) {
		return (
			<AgentProfileCardWrapper>
				<LoadingState profileType="agent" fireAnalytics={fireEvent} />
			</AgentProfileCardWrapper>
		);
	}

	if (hasError || !agent) {
		return (
			<AgentProfileCardWrapper>
				<ErrorMessage errorType={errorType} fireAnalytics={fireEvent} />
			</AgentProfileCardWrapper>
		);
	}

	// creator_type is 'ROVO_DEV' for both the original Rovo Dev agent and the renamed Jira Coding
	// Agent (creator_type was never updated at the source). We use the agent name to distinguish
	// them - once the rename backfill runs, the JCA name becomes 'Jira Coding Agent' and
	// isRovoDev naturally becomes false, falling through to the agentNamedId avatar lookup.
	const isRovoDev = agent.creator_type === 'ROVO_DEV' && agent.name.toLowerCase() === 'rovo dev';

	// Currently, both Jira Coding Agent and Rovo Dev does not support conversations and chat.
	// We previously disabled these for Rovo Dev but we forgot to do the same changes for JCA
	// They are actually the same, just different names.
	const isRovoDevOrJiraCodingAgent =
		isRovoDev ||
		(agent.creator_type === 'ROVO_DEV' && agent.name.toLowerCase() === 'jira coding agent');

	const shouldShowConversationStarters =
		(isRovoDevOrJiraCodingAgent &&
		FeatureGates.getExperimentValue('jira_hide_conversations_for_jca', 'isEnabled', false)
			? false
			: !isRovoDev) &&
		!(fg('jira_ai_hide_conversation_starters_profilecard') && hideConversationStarters);

	const shouldShowAgentActions =
		(isRovoDevOrJiraCodingAgent &&
		FeatureGates.getExperimentValue('jira_hide_conversations_for_jca', 'isEnabled', false)
			? false
			: !isRovoDev) && !(hideAgentActions && fg('issue_view_agent_discovery_fast_follows'));

	return (
		<AgentProfileCardWrapper>
			<Box
				xcss={
					expValEquals('platform_editor_agent_mentions', 'isEnabled', true) &&
					fg('platform_editor_agent_mentions_drop_one_fixes')
						? styles.cardContainerStyles
						: styles.cardContainerStylesLegacy
				}
			>
				<AgentBanner
					agentId={agent.id}
					agentNamedId={agent.external_config_reference ?? agent.named_id}
					height={48}
					agentIdentityAccountId={agent.identity_account_id}
					isRovoDev={isRovoDev}
					creatorType={fg('jira_improve_agent_profile_for_a2a') ? agent.creator_type : undefined}
				/>
				<Box xcss={styles.avatarStyles}>
					<AgentAvatar
						agentId={agent.id}
						agentNamedId={agent.external_config_reference ?? agent.named_id}
						agentIdentityAccountId={agent.identity_account_id}
						size="large"
						isRovoDev={isRovoDev}
						isForgeAgent={
							fg('rovo_agent_support_a2a_avatar')
								? isForgeAgentByCreatorType(agent.creator_type as AgentCreatorType)
								: agent.creator_type === 'FORGE' || agent.creator_type === 'THIRD_PARTY'
						}
						forgeAgentIconUrl={agent.icon}
					/>
				</Box>

				<Stack
					space={
						expValEquals('platform_editor_agent_mentions', 'isEnabled', true) &&
						fg('platform_editor_agent_mentions_drop_one_fixes')
							? 'space.150'
							: 'space.100'
					}
					xcss={styles.detailWrapper}
				>
					<Box xcss={styles.agentProfileInfoWrapper}>
						<AgentProfileInfo
							agentName={agent.name}
							isStarred={isStarred}
							onStarToggle={handleSetFavourite}
							showStarButton={!isRovoDev && !hideStarButton}
							isHidden={agent.visibility === 'PRIVATE'}
							creatorRender={
								agent.creatorInfo?.type && (
									<AgentProfileCreator
										creator={{
											type: agent.creatorInfo?.type,
											name: agent.creatorInfo?.name || '',
											profileLink: agent.creatorInfo?.profileLink || '',
										}}
										isLoading={false}
										onCreatorLinkClick={() => {}}
									/>
								)
							}
							starCountRender={null}
							agentDescription={
								expValEquals('platform_editor_agent_mentions', 'isEnabled', true) &&
								fg('platform_editor_agent_mentions_drop_one_fixes')
									? undefined
									: agent.description
							}
						/>
					</Box>
					{!!agent.description &&
						expValEquals('platform_editor_agent_mentions', 'isEnabled', true) &&
						fg('platform_editor_agent_mentions_drop_one_fixes') && (
							<Box xcss={styles.descriptionWrapper}>
								<Box xcss={styles.description} as="p">
									{agent.description}
								</Box>
							</Box>
						)}
					{!hideAiDisclaimer && fg('rovo_display_ai_disclaimer_on_agent_profile_card') && (
						<Flex
							alignItems="start"
							direction="column"
							gap="space.050"
							xcss={
								expValEquals('platform_editor_agent_mentions', 'isEnabled', true) &&
								fg('platform_editor_agent_mentions_drop_one_fixes')
									? styles.disclosureWrapper
									: styles.disclosureWrapperLegacy
							}
						>
							<TeamsLink
								href="https://www.atlassian.com/trust/atlassian-intelligence"
								intent="reference"
								appearance="subtle"
							>
								<InformationCircleIcon color={token('color.icon.subtlest')} label="" size="small" />
								{` `}
								<Text size="small" color="color.text.subtlest">
									{formatMessage(messages.aiDisclaimer)}
								</Text>
							</TeamsLink>
						</Flex>
					)}
					{shouldShowConversationStarters && (
						<Box xcss={styles.conversationStartersWrapper}>
							<ConversationStarters
								isAgentDefault={agent.is_default}
								userDefinedConversationStarters={userDefinedConversationStarters}
								onConversationStarterClick={(conversationStarter: ConversationStarter) => {
									onConversationStartersClick
										? onConversationStartersClick(conversationStarter)
										: onConversationStarter({
												agentId: agent.id,
												prompt: conversationStarter.message,
											});
								}}
							/>
						</Box>
					)}
				</Stack>
				{shouldShowAgentActions && (
					<AgentActions
						agent={agent}
						onEditAgent={() => onEditAgent(agent.id)}
						onCopyAgent={() => onCopyAgent(agent.id)}
						onDuplicateAgent={async () => await onDuplicateAgent(agent.id)}
						onDeleteAgent={handleOnDelete}
						onChatClick={
							onChatClick
								? (event: React.MouseEvent) => onChatClick(event)
								: () => onOpenChatFullScreen(agent.id, agent.name)
						}
						resourceClient={resourceClient}
						onViewFullProfileClick={() => onViewFullProfile(agent.id)}
						hideMoreActions={hideMoreActions}
					/>
				)}
			</Box>
		</AgentProfileCardWrapper>
	);
};

export default AgentProfileCard;
