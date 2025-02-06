import React from 'react';

import Modal, { ModalBody, ModalTransition } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';

import { CREATE_FORM_MAX_WIDTH_IN_PX } from '../../constants';
import { ErrorBoundaryUI } from '../error-boundary-ui';

import { ErrorBoundaryModalOld } from './old';

/**
 * ErrorBoundaryModal props are the same as those passed to LinkCreate, which
 * are used to control its active state
 */
type ErrorBoundaryModalProps = {
	active?: boolean;
	onClose?: () => void;
};

const ErrorBoundaryModalNew = ({ active, onClose }: ErrorBoundaryModalProps): JSX.Element => {
	return (
		<ModalTransition>
			{active && (
				<Modal
					testId="link-create-error-boundary-modal"
					onClose={onClose}
					shouldScrollInViewport={true}
					width={`${CREATE_FORM_MAX_WIDTH_IN_PX}px`}
				>
					<ModalBody>
						<ErrorBoundaryUI />
					</ModalBody>
				</Modal>
			)}
		</ModalTransition>
	);
};

export const ErrorBoundaryModal = (props: ErrorBoundaryModalProps) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <ErrorBoundaryModalNew {...props} />;
	}
	return <ErrorBoundaryModalOld {...props} />;
};
