import React, { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import InformationCircleIcon from '@atlaskit/icon/core/information-circle';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import {
	AgentAvatar,
	AgentBanner,
	AgentProfileCreator,
	AgentProfileInfo,
	AgentStarCount,
	type ConversationStarter,
} from '@atlaskit/rovo-agent-components';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
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
	detailWrapper: { paddingBlockStart: token('space.400'), paddingInline: token('space.200') },
	detailWrapperRefresh: {
		paddingBlockStart: token('space.300'),
	},
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
	agentProfileInfoWrapper: {
		paddingInline: token('space.200'),
	},
	conversationStartersWrapper: {
		paddingInline: token('space.150'),
	},
	disclosureWrapperRefresh: {
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInline: token('space.200'),
		gap: token('space.050'),
	},
	disclosureWrapper: {
		paddingBlockEnd: token('space.150'),
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
	hideMoreActions,
	hideAiDisclaimer = false,
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

	const isRovoDev = agent.creator_type === 'ROVO_DEV';

	return (
		<AgentProfileCardWrapper>
			<Box xcss={styles.cardContainerStyles}>
				<AgentBanner
					agentId={agent.id}
					agentNamedId={agent.external_config_reference ?? agent.named_id}
					height={fg('rovo_agent_empty_state_refresh') ? 48 : 96}
					agentIdentityAccountId={agent.identity_account_id}
					isRovoDev={isRovoDev && fg('rovo_dev_themed_identity_card')}
				/>
				<Box xcss={styles.avatarStyles}>
					<AgentAvatar
						agentId={agent.id}
						agentNamedId={agent.external_config_reference ?? agent.named_id}
						agentIdentityAccountId={agent.identity_account_id}
						size={fg('rovo_agent_empty_state_refresh') ? 'large' : 'xlarge'}
						isRovoDev={isRovoDev && fg('rovo_dev_themed_identity_card')}
						isForgeAgent={agent.creator_type === 'FORGE' || agent.creator_type === 'THIRD_PARTY'}
						forgeAgentIconUrl={agent.icon}
					/>
				</Box>

				<Stack
					space="space.100"
					xcss={
						fg('rovo_agent_empty_state_refresh')
							? styles.detailWrapperRefresh
							: styles.detailWrapper
					}
				>
					<Box xcss={fg('rovo_agent_empty_state_refresh') ? styles.agentProfileInfoWrapper : null}>
						<AgentProfileInfo
							agentName={agent.name}
							isStarred={isStarred}
							onStarToggle={handleSetFavourite}
							showStarButton={!(isRovoDev && fg('rovo_dev_themed_identity_card'))}
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
							starCountRender={
								fg('rovo_agent_empty_state_refresh') ? null : (
									<AgentStarCount starCount={starCount} isLoading={false} />
								)
							}
							agentDescription={agent.description}
						/>
					</Box>
					{!hideAiDisclaimer && fg('rovo_display_ai_disclaimer_on_agent_profile_card') && (
						<Flex
							alignItems="start"
							direction="column"
							gap="space.050"
							xcss={
								fg('rovo_agent_empty_state_refresh')
									? styles.disclosureWrapperRefresh
									: styles.disclosureWrapper
							}
						>
							<Link
								href="https://www.atlassian.com/trust/atlassian-intelligence"
								target="_blank"
								rel="noopener noreferrer"
								appearance="subtle"
							>
								<InformationCircleIcon color={token('color.icon.subtlest')} label="" size="small" />
								{` `}
								<Text size="small" color="color.text.subtlest">
									{formatMessage(messages.aiDisclaimer)}
								</Text>
							</Link>
						</Flex>
					)}
					{!(isRovoDev && fg('rovo_dev_themed_identity_card')) && (
						<Box
							xcss={
								fg('rovo_agent_empty_state_refresh') ? styles.conversationStartersWrapper : null
							}
						>
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
				{!(isRovoDev && fg('rovo_dev_themed_identity_card')) && (
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
						hideMoreActions={hideMoreActions}
					/>
				)}
			</Box>
		</AgentProfileCardWrapper>
	);
};

export default AgentProfileCard;
