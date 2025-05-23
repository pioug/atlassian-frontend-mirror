import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { messages } from '@atlaskit/editor-common/floating-toolbar';
import type { ConfirmationDialogProps } from '@atlaskit/editor-common/types';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';
export const SimpleModal = (props: ConfirmationDialogProps & WrappedComponentProps) => {
	const {
		onConfirm,
		onClose,
		options,
		intl: { formatMessage },
		testId,
	} = props;

	const heading = options?.title || formatMessage(messages.confirmModalDefaultHeading);
	const okButtonLabel = options?.okButtonLabel || formatMessage(messages.confirmModalOK);
	const cancelButtonLabel =
		options?.cancelButtonLabel || formatMessage(messages.confirmModalCancel);

	return (
		<Modal onClose={onClose} testId={testId}>
			<ModalHeader>
				<ModalTitle appearance="warning">{heading}</ModalTitle>
			</ModalHeader>

			<ModalBody>
				<Text as="p">{options?.message}</Text>
			</ModalBody>
			<ModalFooter>
				<Button
					appearance="default"
					onClick={onClose}
					testId={testId ? `${testId}-cancel-button` : undefined}
				>
					{cancelButtonLabel}
				</Button>
				<Button
					appearance="warning"
					onClick={() => {
						onConfirm();
						onClose();
					}}
					testId={testId ? `${testId}-confirm-button` : undefined}
				>
					{okButtonLabel}
				</Button>
			</ModalFooter>
		</Modal>
	);
};
