import React, { useState } from 'react';

import { defineMessages, FormattedMessage, useIntl } from 'react-intl-next';

import Button, { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { ChatPillIcon } from '@atlaskit/rovo-agent-components';

import { AgentDeleteConfirmationModal } from './AgentDeleteConfirmationModal';

type AgentActionsProps = {
	isAgentCreatedByCurrentUser?: boolean;
	onEditAgent: () => void;
	onCopyAgent: () => void;
	onDuplicateAgent: () => void;
	onDeleteAgent: () => void;
	onChatClick: () => void;
};

interface ActionMenuItem {
	text: React.ReactNode;

	onClick?: () => void;

	isDisabled?: boolean;
}

const chatToAgentButtonContainer = xcss({
	width: '100%',
});

const buttonStyles = xcss({
	borderRadius: '3px',
	color: 'color.text',
	backgroundColor: 'color.background.neutral',

	':hover': {
		backgroundColor: 'color.background.neutral.hovered',
	},

	':active': {
		backgroundColor: 'color.background.neutral.pressed',
	},
});

const chatToAgentButtonWrapper = xcss({
	display: 'flex',
	justifyContent: 'center',
	lineHeight: '20px',
	padding: 'space.075',
	fontWeight: '500',
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

const actopnsWrapperStyles = xcss({
	borderTop: '1px',
	borderTopStyle: 'solid',
	borderColor: 'color.border',
	padding: 'space.200',
	marginBlockStart: 'space.200',
	color: 'color.text',
});
const buildAgentActions = ({
	onDuplicateAgent,
	onCopyAgent,
}: {
	onCopyAgent: () => void;
	onDuplicateAgent: () => void;
}): ActionMenuItem[] => {
	return [
		{
			text: <FormattedMessage {...messages.actionDuplicate} />,
			onClick: onDuplicateAgent,
		},
		{
			text: <FormattedMessage {...messages.actionCopyLink} />,
			onClick: onCopyAgent,
		},
	];
};
const buildAgentSettings = ({
	onEditAgent,
	onDeleteAgent,
}: {
	onEditAgent: () => void;
	onDeleteAgent: () => void;
}): ActionMenuItem[] => {
	return [
		{
			text: <FormattedMessage {...messages.actionEdit} />,
			onClick: onEditAgent,
		},
		{
			text: <FormattedMessage {...messages.actionDelete} />,
			onClick: onDeleteAgent,
		},
	];
};

export const AgentActions = ({
	isAgentCreatedByCurrentUser,
	onEditAgent,
	onDeleteAgent,
	onDuplicateAgent,
	onCopyAgent,
	onChatClick,
}: AgentActionsProps) => {
	const { formatMessage } = useIntl();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const agentActions = buildAgentActions({ onDuplicateAgent, onCopyAgent });
	const agentSetting = buildAgentSettings({
		onEditAgent,
		onDeleteAgent: () => {
			setIsDeleteModalOpen(true);
		},
	});

	return (
		<>
			<Inline space="space.100" xcss={actopnsWrapperStyles}>
				<Box xcss={[chatToAgentButtonContainer, buttonStyles]}>
					<Button shouldFitContainer onClick={onChatClick}>
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
				{/* <ChatToAgentButton onClick={(_, analyticsEvents) => handleClickChat(analyticsEvents)} /> */}

				<DropdownMenu<HTMLButtonElement>
					trigger={({ triggerRef, ...props }) => (
						<Box xcss={buttonStyles}>
							<IconButton {...props} icon={MoreIcon} label="more" ref={triggerRef} />
						</Box>
					)}
					placement="bottom-end"
				>
					<DropdownItemGroup>
						{agentActions.map(({ text, onClick }, idx) => {
							return (
								<DropdownItem key={idx} onClick={onClick}>
									{text}
								</DropdownItem>
							);
						})}
					</DropdownItemGroup>
					{isAgentCreatedByCurrentUser && (
						<DropdownItemGroup hasSeparator>
							{agentSetting.map(({ text, onClick }, idx) => {
								return (
									<DropdownItem key={idx} onClick={onClick}>
										{text}
									</DropdownItem>
								);
							})}
						</DropdownItemGroup>
					)}
				</DropdownMenu>
			</Inline>
			<AgentDeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
				}}
				onSubmit={onDeleteAgent}
				agentId={'some Id'}
				agentName="agentName"
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
	actionDelete: {
		id: 'ptc-directory.agent-profile.action.dropdown.delete.nonfinal',
		defaultMessage: 'Delete Agent',
		description: 'Text for the "Delete" action to delete an agent',
	},
	actionEdit: {
		id: 'ptc-directory.agent-profile.action.dropdown.edit.nonfinal',
		defaultMessage: 'Edit Agent',
		description: 'Text for the "Edit" action to edit an agent',
	},
	actionCopyLink: {
		id: 'ptc-directory.agent-profile.action.dropdown.copy-link.nonfinal',
		defaultMessage: 'Copy link',
		description: 'Text for the Copy link of an agent',
	},
	actionDuplicate: {
		id: 'ptc-directory.agent-profile.action.dropdown.duplicate.nonfinal',
		defaultMessage: 'Duplicate Agent',
		description: 'Text for the Duplicate Agent action to create a duplicate',
	},
});
