import React, { useCallback, useState } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { AgentDropdownMenu, ChatPillIcon } from '@atlaskit/rovo-agent-components';

import { type ProfileClient, type RovoAgentProfileCardInfo } from '../../types';

import { AgentDeleteConfirmationModal } from './AgentDeleteConfirmationModal';

type AgentActionsProps = {
	agent: RovoAgentProfileCardInfo;
	isAgentCreatedByCurrentUser?: boolean;
	onEditAgent: () => void;
	onCopyAgent: () => void;
	onDuplicateAgent: () => void;
	onDeleteAgent: () => void;
	onChatClick: () => void;
	onViewFullProfileClick: () => void;
	resourceClient: ProfileClient;
};

const chatToAgentButtonContainer = xcss({
	width: '100%',
});

const chatToAgentButtonWrapper = xcss({
	display: 'flex',
	justifyContent: 'center',
	lineHeight: '20px',
	fontWeight: 'font.weight.medium',
});

const chatPillButtonInlineStyles = xcss({ paddingInline: 'space.025' });

const chatPillTextStyles = xcss({
	wordBreak: 'break-word',
	textAlign: 'left',
	whiteSpace: 'pre-wrap',
});

const chatPillIconWrapper = xcss({
	minWidth: '20px',
	height: '20px',
});

const actionsWrapperStyles = xcss({
	borderTop: '1px',
	borderTopStyle: 'solid',
	borderColor: 'color.border',
	padding: 'space.200',
	marginBlockStart: 'space.200',
	color: 'color.text',
});

export const AgentActions = ({
	isAgentCreatedByCurrentUser,
	onEditAgent,
	onDeleteAgent,
	onDuplicateAgent,
	onCopyAgent,
	onChatClick,
	onViewFullProfileClick,
	agent,
	resourceClient,
}: AgentActionsProps) => {
	const { formatMessage } = useIntl();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const isForgeAgent = agent.creator_type === 'FORGE' || agent.creator_type === 'THIRD_PARTY';

	const loadAgentPermissions = useCallback(async () => {
		const {
			permissions: { AGENT_UPDATE, AGENT_DEACTIVATE },
		} = await resourceClient.getRovoAgentPermissions(agent.id);

		return {
			isEditEnabled: AGENT_UPDATE.permitted,
			isDeleteEnabled: AGENT_DEACTIVATE.permitted,
		};
	}, [agent.id, resourceClient]);

	return (
		<>
			<Inline space="space.100" xcss={actionsWrapperStyles}>
				<Box xcss={chatToAgentButtonContainer}>
					<Button
						shouldFitContainer
						onClick={(e) => {
							e.stopPropagation();
							onChatClick();
						}}
					>
						<Box xcss={chatToAgentButtonWrapper}>
							<Inline space="space.050" xcss={chatPillButtonInlineStyles}>
								<Box xcss={chatPillIconWrapper}>
									<ChatPillIcon />
								</Box>
								<Box xcss={chatPillTextStyles}>{formatMessage(messages.actionChatToAgent)}</Box>
							</Inline>
						</Box>
					</Button>
				</Box>

				<AgentDropdownMenu
					agentId={agent.id}
					isAgentCreatedByUser={isAgentCreatedByCurrentUser ?? false}
					onDeleteAgent={() => setIsDeleteModalOpen(true)}
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
		id: 'ptc-directory.agent-profile.action.dropdown.chat-to-agent.nonfinal',
		defaultMessage: 'Chat to Agent',
		description: 'Text for the "chat to agent" action to chat to the agent',
	},
});
