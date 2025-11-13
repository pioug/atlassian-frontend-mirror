import React, { useCallback } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: () => void;
	agentId: string;
	agentName: string;
};

export const AgentDeleteConfirmationModal = ({
	onClose,
	agentName,
	isOpen,
	onSubmit,
	agentId,
}: Props) => {
	const { formatMessage } = useIntl();

	const handleDeleteAgent = useCallback(async () => {
		if (agentId) {
			await onSubmit();
			onClose();
		}
	}, [agentId, onClose, onSubmit]);

	return (
		<ModalTransition>
			{isOpen && (
				<Modal width="small">
					<ModalHeader hasCloseButton>
						<ModalTitle>{formatMessage(messages.title, { agentName })}</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<Text as="p">{formatMessage(messages.body)}</Text>
						<ModalFooter>
							<Button appearance="subtle" onClick={onClose}>
								{formatMessage(messages.cancelText)}
							</Button>
							<Button
								appearance="danger"
								onClick={(_e, _event: UIAnalyticsEvent) => {
									handleDeleteAgent();
								}}
							>
								{formatMessage(messages.confirmText)}
							</Button>
						</ModalFooter>
					</ModalBody>
				</Modal>
			)}
		</ModalTransition>
	);
};

const messages = defineMessages({
	cancelText: {
		id: 'profilecard.agent-profile.agent-delete-confirm.cancel-text',
		defaultMessage: 'Cancel',
	},
	confirmText: {
		id: 'profilecard.agent-profile.agent-delete-confirm.confirm-text',
		defaultMessage: 'Delete',
	},
	title: {
		id: 'profilecard.agent-profile.delete-agent-confirm-title',
		defaultMessage: 'Delete "{agentName}"?',
		description: 'Title text for the delete agent confirmation modal',
	},
	body: {
		id: 'profilecard.agent-profile.delete-agent-confirm-body',
		defaultMessage: `Are you sure you want to delete this agent? This action cannot be undone.`,
		description: 'Body text for the delete agent confirmation modal',
	},
	error: {
		id: 'profilecard.agent-profile.delete-agent-error',
		defaultMessage: 'Could not delete agent',
		description: 'Error message displayed when an agent cannot be deleted',
	},
	errorAgentNotFound: {
		id: 'profilecard.agent-profile.delete-agent-error.agent-not-found',
		defaultMessage: 'That agent could not be found.',
		description: 'Error message displayed when an agent cannot be found',
	},
	errorAgentInUse: {
		id: 'profilecard.agent-profile.delete-agent-error.agent-in-use',
		defaultMessage: 'Agent is currently in use. Try again later.',
		description: 'Error message displayed when an agent is in use',
	},
	errorIncorrectOwner: {
		id: 'profilecard.agent-profile.delete-agent-error.incorrect-owner',
		defaultMessage:
			'You cannot delete agents you have not created yourself. Please contact the agent owner.',
		description: 'Error message displayed when the agent owner is incorrect',
	},
	agentDeletedSuccess: {
		id: 'profilecard.agent-profile.delete-agent-success',
		defaultMessage: 'Agent has been deleted!',
		description: 'Success message displayed when an agent is deleted',
	},
});
