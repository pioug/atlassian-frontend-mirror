import React from 'react';

import { useIntl } from 'react-intl-next';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

import { Button } from '../Button';
import { Modal } from '../ModalDialog';

import messages from './messages';

export type ConfirmDismissDialogProps = {
	active: boolean;
	onClose: () => void;
	onCancel?: () => void;
};

const screen = 'linkCreateExitWarningScreen';

const context = { component: screen, source: screen };

export const ConfirmDismissDialog = ({
	active,
	onClose,
	onCancel,
}: ConfirmDismissDialogProps): React.JSX.Element => {
	const intl = useIntl();

	const onCancelDismiss = () => onClose();

	const onConfirmDismiss = () => {
		onClose();
		onCancel?.();
	};

	return (
		<ModalTransition>
			{active && (
				<AnalyticsContext data={context}>
					<Modal
						testId="link-create-confirm-dismiss-dialog"
						screen={screen}
						onClose={onCancelDismiss}
						width="small"
					>
						<ModalHeader hasCloseButton>
							<ModalTitle>{intl.formatMessage(messages.title)}</ModalTitle>
						</ModalHeader>
						<ModalBody>{intl.formatMessage(messages.description)}</ModalBody>
						<ModalFooter>
							<Button actionSubjectId="cancel" appearance="subtle" onClick={onCancelDismiss}>
								{intl.formatMessage(messages.cancelButtonLabel)}
							</Button>
							<Button actionSubjectId="confirm" appearance="primary" onClick={onConfirmDismiss}>
								{intl.formatMessage(messages.confirmButtonLabel)}
							</Button>
						</ModalFooter>
					</Modal>
				</AnalyticsContext>
			)}
		</ModalTransition>
	);
};
