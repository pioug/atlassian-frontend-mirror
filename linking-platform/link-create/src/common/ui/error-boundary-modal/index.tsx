/** @jsx jsx */
import { jsx } from '@emotion/react';

import Modal, { ModalBody, ModalTransition } from '@atlaskit/modal-dialog';

import { CREATE_FORM_MAX_WIDTH_IN_PX } from '../../constants';
import { ErrorBoundaryUI } from '../error-boundary-ui';

/**
 * ErrorBoundaryModal props are the same as those passed to LinkCreate, which
 * are used to control its active state
 */
type ErrorBoundaryModalProps = {
	active?: boolean;
	onClose?: () => void;
};

export const ErrorBoundaryModal: React.FC<ErrorBoundaryModalProps> = ({ active, onClose }) => {
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
