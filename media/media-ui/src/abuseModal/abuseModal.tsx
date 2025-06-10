import React from 'react';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { messages } from '../messages';

export type AbuseModalProps = {
	isOpen: boolean;
	onConfirm: () => void;
	onClose: () => void;
};

export const AbuseModal = injectIntl<'intl', AbuseModalProps & WrappedComponentProps>(
	({ isOpen, onConfirm, onClose, intl: { formatMessage } }) => {
		return (
			<ModalTransition>
				{isOpen && (
					<Modal onClose={onClose} testId="mediaAbuseModal">
						<ModalHeader hasCloseButton>
							<ModalTitle appearance="warning">
								{formatMessage(messages.abuse_modal_title)}
							</ModalTitle>
						</ModalHeader>
						<ModalBody>{formatMessage(messages.abuse_modal_body)}</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={onClose}>
								{formatMessage(messages.cancel)}
							</Button>
							<Button appearance="warning" onClick={onConfirm}>
								{formatMessage(messages.abuse_modal_submit)}
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		);
	},
);
