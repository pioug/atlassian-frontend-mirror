import React, { useCallback, useState } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { AgentDropdownMenu, ChatPillIcon } from '@atlaskit/rovo-agent-components';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import { token } from '@atlaskit/tokens';

import { type ProfileClient, type RovoAgentProfileCardInfo } from '../../types';
import { fireEvent } from '../../util/analytics';

import { AgentDeleteConfirmationModal } from './AgentDeleteConfirmationModal';

type AgentActionsProps = {
	agent: RovoAgentProfileCardInfo;
	onEditAgent: () => void;
	onCopyAgent: () => void;
	onDuplicateAgent: () => void;
	onDeleteAgent: () => void;
	onChatClick: (event: React.MouseEvent) => void;
	onViewFullProfileClick: () => void;
	resourceClient: ProfileClient;
	hideMoreActions?: boolean;
};

const styles = cssMap({
	chatToAgentButtonContainer: {
		width: '100%',
	},
	chatToAgentButtonWrapper: {
		display: 'flex',
		justifyContent: 'center',
		fontWeight: token('font.weight.medium'),
		height: '20px',
	},
	chatPillButtonInlineStyles: { paddingInline: token('space.025') },
	chatPillTextStyles: {
		wordBreak: 'break-word',
		textAlign: 'left',
		whiteSpace: 'pre-wrap',
	},
	chatPillIconWrapper: { minWidth: '20px', height: '20px' },
	actionsWrapperStyles: {
		borderTopStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		marginBlockStart: token('space.200'),
		color: token('color.text'),
	},
});

export const AgentActions = ({
	onEditAgent,
	onDeleteAgent,
	onDuplicateAgent,
	onCopyAgent,
	onChatClick,
	onViewFullProfileClick,
	agent,
	resourceClient,
	hideMoreActions,
}: AgentActionsProps) => {
	const { formatMessage } = useIntl();
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { fireEvent: fireEventNext } = useAnalyticsEventsNext();

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const isForgeAgent = agent.creator_type === 'FORGE' || agent.creator_type === 'THIRD_PARTY';

	const loadAgentPermissions = useCallback(async () => {
		const {
			permissions: { AGENT_CREATE, AGENT_UPDATE, AGENT_DEACTIVATE },
		} = await resourceClient.getRovoAgentPermissions(agent.id);

		return {
			isCreateEnabled: AGENT_CREATE.permitted,
			isEditEnabled: AGENT_UPDATE.permitted,
			isDeleteEnabled: AGENT_DEACTIVATE.permitted,
		};
	}, [agent.id, resourceClient]);

	const handleDeleteAgent = useCallback(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			fireEventNext('ui.button.clicked.deleteAgentButton', {
				agentId: agent.id,
				source: 'agentProfileCard',
			});
		} else {
			fireEvent(createAnalyticsEvent, {
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'deleteAgentButton',
				attributes: {
					agentId: agent.id,
					source: 'agentProfileCard',
				},
			});
		}

		setIsDeleteModalOpen(true);
	}, [agent.id, createAnalyticsEvent, fireEventNext]);

	return (
		<>
			<Inline space="space.100" xcss={styles.actionsWrapperStyles}>
				<Box xcss={styles.chatToAgentButtonContainer}>
					<Button
						shouldFitContainer
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							onChatClick(e);
						}}
					>
						<Box xcss={styles.chatToAgentButtonWrapper}>
							<Inline
								space="space.050"
								xcss={styles.chatPillButtonInlineStyles}
								alignBlock="center"
							>
								<Box xcss={styles.chatPillIconWrapper}>
									<ChatPillIcon />
								</Box>
								<Box xcss={styles.chatPillTextStyles}>
									{formatMessage(messages.actionChatToAgent)}
								</Box>
							</Inline>
						</Box>
					</Button>
				</Box>

				{!hideMoreActions && (
					<AgentDropdownMenu
						agentId={agent.id}
						onDeleteAgent={handleDeleteAgent}
						onEditAgent={onEditAgent}
						onDuplicateAgent={onDuplicateAgent}
						onCopyAgent={onCopyAgent}
						isForgeAgent={isForgeAgent}
						loadAgentPermissions={loadAgentPermissions}
						loadPermissionsOnMount
						onViewAgentFullProfileClick={onViewFullProfileClick}
						doesAgentHaveIdentityAccountId={!!agent.identity_account_id}
						shouldTriggerStopPropagation
					/>
				)}
			</Inline>
			<AgentDeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
				}}
				onSubmit={onDeleteAgent}
				agentId={agent.id}
				agentName={agent.name}
			/>
		</>
	);
};

const messages = defineMessages({
	actionChatToAgent: {
		id: 'ptc-directory.agent-profile.action.dropdown.chat-with-agent',
		defaultMessage: 'Chat with Agent',
		description: 'Text for the "chat with agent" action to chat to the agent',
	},
});
