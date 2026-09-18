import React from 'react';

import type { WrappedComponentProps } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { messages } from '@atlaskit/editor-common/floating-toolbar';
import type { ConfirmationDialogProps } from '@atlaskit/editor-common/types';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { Text } from '@atlaskit/primitives/compiled';
export const SimpleModal = (
	props: ConfirmationDialogProps & WrappedComponentProps,
): React.JSX.Element => {
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
			<ModalHeader hasCloseButton>
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
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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
