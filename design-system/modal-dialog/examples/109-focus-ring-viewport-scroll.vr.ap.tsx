import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';

// Nothing inside can take focus, so focus rests on the modal, which shows the focus ring.
export default function FocusRingViewportScroll(): React.JSX.Element {
	return (
		<Modal onClose={noop} shouldScrollInViewport>
			{/* eslint-disable-next-line @atlaskit/design-system/use-modal-dialog-close-button -- nothing focusable on purpose */}
			<ModalHeader>
				<ModalTitle>Viewport scroll, nothing focusable</ModalTitle>
			</ModalHeader>
			<ModalBody>Loading</ModalBody>
		</Modal>
	);
}
