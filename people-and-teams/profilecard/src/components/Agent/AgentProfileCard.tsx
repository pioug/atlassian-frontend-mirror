import React, { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';
import {
	AgentAvatar,
	AgentBanner,
	AgentProfileCreator,
	AgentProfileInfo,
	AgentStarCount,
	type ConversationStarter,
} from '@atlaskit/rovo-agent-components';

import { type AgentProfileCardProps } from '../../types';
import { fireEvent, profileCardRendered } from '../../util/analytics';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../Error';

import { AgentActions } from './Actions';
import { AgentProfileCardWrapper } from './AgentProfileCardWrapper';
import { ConversationStarters } from './ConversationStarters';
import { useAgentUrlActions } from './hooks/useAgentActions';
import { messages } from './messages';

const styles = xcss({ paddingBlockStart: 'space.400', paddingInline: 'space.200' });

const avatarStyles = xcss({
	position: 'absolute',
	top: 'space.300',
	left: 'space.200',
});

const cardContainerStyles = xcss({
	borderRadius: 'border.radius.200',
	boxShadow: 'elevation.shadow.overlay',
	position: 'relative',
});

const AgentProfileCard = ({
	agent,
	isLoading,
	isCreatedByViewingUser,
	cloudId,
	onChatClick,
	product = 'rovo',
	hasError,
	errorType,
	onConversationStartersClick,
	resourceClient,
	addFlag,
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
		if (agent) {
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
				addFlag?.({
					title: formatMessage(messages.agentDeletedErrorFlagTitle),
					description: formatMessage(messages.agentDeletedErrorFlagDescription),
					type: 'error',
					id: 'ptc-directory.agent-profile.delete-agent-error',
				});
			}
		}
	}, [addFlag, agent, fireAnalytics, formatMessage, resourceClient]);

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
				<ErrorMessage errorType={errorType} fireAnalytics={fireAnalytics} />
			</AgentProfileCardWrapper>
		);
	}

	return (
		<AgentProfileCardWrapper>
			<Box xcss={cardContainerStyles}>
				<AgentBanner
					agentId={agent.id}
					agentNamedId={agent.external_config_reference ?? agent.named_id}
					height={96}
					agentIdentityAccountId={agent.identity_account_id}
				/>
				<Box xcss={avatarStyles}>
					<AgentAvatar
						agentId={agent.id}
						agentNamedId={agent.external_config_reference ?? agent.named_id}
						agentIdentityAccountId={agent.identity_account_id}
						size="xlarge"
						isForgeAgent={agent.creator_type === 'FORGE' || agent.creator_type === 'THIRD_PARTY'}
						forgeAgentIconUrl={agent.icon}
					/>
				</Box>

				<Stack space="space.100" xcss={styles}>
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
					isAgentCreatedByCurrentUser={isCreatedByViewingUser}
					onEditAgent={() => onEditAgent(agent.id)}
					onCopyAgent={() => onCopyAgent(agent.id)}
					onDuplicateAgent={() => onDuplicateAgent(agent.id)}
					onDeleteAgent={handleOnDelete}
					onChatClick={() =>
						onChatClick ? onChatClick() : onOpenChatFullScreen(agent.id, agent.name)
					}
					resourceClient={resourceClient}
					onViewFullProfileClick={() => onViewFullProfile(agent.id)}
				/>
			</Box>
		</AgentProfileCardWrapper>
	);
};

export default AgentProfileCard;
