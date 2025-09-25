import React, { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import {
	AgentAvatar,
	AgentBanner,
	AgentProfileCreator,
	AgentProfileInfo,
	AgentStarCount,
	type ConversationStarter,
} from '@atlaskit/rovo-agent-components';
import { token } from '@atlaskit/tokens';

import { type AgentProfileCardProps } from '../../types';
import { fireEvent, profileCardRendered } from '../../util/analytics';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../Error';

import { AgentActions } from './Actions';
import { AgentProfileCardWrapper } from './AgentProfileCardWrapper';
import { ConversationStarters } from './ConversationStarters';
import { useAgentUrlActions } from './hooks/useAgentActions';
import { messages } from './messages';

const styles = cssMap({
	detailWrapper: { paddingBlockStart: token('space.400'), paddingInline: token('space.200') },
	avatarStyles: {
		position: 'absolute',
		top: token('space.300'),
		left: token('space.200'),
	},
	cardContainerStyles: {
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
		position: 'relative',
	},
});

const AgentProfileCard = ({
	agent,
	isLoading,
	cloudId,
	onChatClick,
	hasError,
	errorType,
	onConversationStartersClick,
	resourceClient,
	addFlag,
	onDeleteAgent,
}: AgentProfileCardProps) => {
	const {
		onEditAgent,
		onCopyAgent,
		onDuplicateAgent,
		onOpenChat: onOpenChatFullScreen,
		onConversationStarter,
		onViewFullProfile,
	} = useAgentUrlActions({
		cloudId: cloudId || '',
		source: 'agentProfileCard',
	});

	const [isStarred, setIsStarred] = useState(false);
	const [starCount, setStarCount] = useState<number | undefined>();
	const { formatMessage } = useIntl();

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

	const { createAnalyticsEvent } = useAnalyticsEvents();

	const fireAnalytics = useCallback(
		(payload: AnalyticsEventPayload) => {
			if (createAnalyticsEvent) {
				fireEvent(createAnalyticsEvent, payload);
			}
		},
		[createAnalyticsEvent],
	);
	const handleSetFavourite = useCallback(async () => {
		if (agent?.id) {
			try {
				await resourceClient.setFavouriteAgent(agent.id, !isStarred, fireAnalytics);
				if (isStarred) {
					setStarCount(starCount ? starCount - 1 : 0);
				} else {
					setStarCount((starCount || 0) + 1);
				}
				setIsStarred(!isStarred);
			} catch (error) {}
		}
	}, [agent?.id, fireAnalytics, isStarred, resourceClient, starCount]);

	const handleOnDelete = useCallback(async () => {
		if (agent && onDeleteAgent) {
			// Optimistically remove from cache
			const { restore } = onDeleteAgent(agent.id);

			try {
				await resourceClient.deleteAgent(agent.id, fireAnalytics);

				addFlag?.({
					title: formatMessage(messages.agentDeletedSuccessFlagTitle),
					description: formatMessage(messages.agentDeletedSuccessFlagDescription, {
						agentName: agent.name,
					}),
					type: 'success',
					id: 'ptc-directory.agent-profile.delete-agent-success',
				});
			} catch (error) {
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
	}, [addFlag, agent, formatMessage, onDeleteAgent, resourceClient, fireAnalytics]);

	useEffect(() => {
		if (!isLoading && agent) {
			fireAnalytics(profileCardRendered('agent', 'content'));
		}
	}, [agent, fireAnalytics, isLoading]);

	if (isLoading) {
		return (
			<AgentProfileCardWrapper>
				<LoadingState profileType="agent" fireAnalytics={fireAnalytics} />
			</AgentProfileCardWrapper>
		);
	}

	if (hasError || !agent) {
		return (
			<AgentProfileCardWrapper>
				<ErrorMessage
					fireAnalyticsNext={() => {}}
					errorType={errorType}
					fireAnalytics={fireAnalytics}
				/>
			</AgentProfileCardWrapper>
		);
	}

	return (
		<AgentProfileCardWrapper>
			<Box xcss={styles.cardContainerStyles}>
				<AgentBanner
					agentId={agent.id}
					agentNamedId={agent.external_config_reference ?? agent.named_id}
					height={96}
					agentIdentityAccountId={agent.identity_account_id}
				/>
				<Box xcss={styles.avatarStyles}>
					<AgentAvatar
						agentId={agent.id}
						agentNamedId={agent.external_config_reference ?? agent.named_id}
						agentIdentityAccountId={agent.identity_account_id}
						size="xlarge"
						isForgeAgent={agent.creator_type === 'FORGE' || agent.creator_type === 'THIRD_PARTY'}
						forgeAgentIconUrl={agent.icon}
					/>
				</Box>

				<Stack space="space.100" xcss={styles.detailWrapper}>
					<AgentProfileInfo
						agentName={agent.name}
						isStarred={isStarred}
						onStarToggle={handleSetFavourite}
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
						starCountRender={<AgentStarCount starCount={starCount} isLoading={false} />}
						agentDescription={agent.description}
					/>

					<ConversationStarters
						isAgentDefault={agent.is_default}
						userDefinedConversationStarters={userDefinedConversationStarters}
						onConversationStarterClick={(conversationStarter: ConversationStarter) => {
							onConversationStartersClick
								? onConversationStartersClick(conversationStarter)
								: onConversationStarter({ agentId: agent.id, prompt: conversationStarter.message });
						}}
					/>
				</Stack>
				<AgentActions
					agent={agent}
					onEditAgent={() => onEditAgent(agent.id)}
					onCopyAgent={() => onCopyAgent(agent.id)}
					onDuplicateAgent={() => onDuplicateAgent(agent.id)}
					onDeleteAgent={handleOnDelete}
					onChatClick={
						onChatClick
							? (event: React.MouseEvent) => onChatClick(event)
							: () => onOpenChatFullScreen(agent.id, agent.name)
					}
					resourceClient={resourceClient}
					onViewFullProfileClick={() => onViewFullProfile(agent.id)}
				/>
			</Box>
		</AgentProfileCardWrapper>
	);
};

export default AgentProfileCard;
