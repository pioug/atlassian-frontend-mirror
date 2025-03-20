import React, { type FC, useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import Popup from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';

const spacerStyles = xcss({
	margin: 'space.100',
});

const sizedContentStyles = xcss({
	padding: 'space.400',
	alignItems: 'center',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'center',
});

const PopupContent: FC = () => {
	const [showModal, setShowModal] = useState(false);

	const open = useCallback(() => setShowModal(true), []);
	const close = useCallback(() => setShowModal(false), []);

	return (
		<Box xcss={sizedContentStyles}>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{showModal && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Lorem count={2} />
						</ModalBody>
						<ModalFooter>
							<Button testId="secondary" appearance="subtle" onClick={close}>
								Secondary Action
							</Button>
							<Button testId="primary" appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
};

const PopupPlacementExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box xcss={spacerStyles}>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent />}
				trigger={(triggerProps) => (
					<Button id="popup-trigger" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
			/>
		</Box>
	);
};

export default PopupPlacementExample;
