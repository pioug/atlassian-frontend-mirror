import React from 'react';
import { type WithIntlProps, type WrappedComponentProps, injectIntl } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { messages } from '../messages';

export type AbuseModalProps = {
	isOpen: boolean;
	onConfirm: () => void;
	onClose: () => void;
};

export const AbuseModal: React.FC<WithIntlProps<AbuseModalProps & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<AbuseModalProps & WrappedComponentProps>;
} = injectIntl<'intl', AbuseModalProps & WrappedComponentProps>(
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
