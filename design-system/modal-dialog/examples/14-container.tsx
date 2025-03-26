import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives/compiled';

const customContainerStyles = cssMap({
	root: {
		display: 'flex',
		height: '700px',
		flex: '1 1 auto',
		flexDirection: 'column',
	},
});

export default function DefaultModal() {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const secondaryAction = useCallback(() => alert('Secondary button has been clicked!'), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<Box
							xcss={customContainerStyles.root}
							backgroundColor="color.background.warning"
							testId="custom-container"
						>
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<Lorem count={2} />
							</ModalBody>
							<ModalFooter>
								<Button testId="secondary" appearance="subtle" onClick={secondaryAction}>
									Secondary Action
								</Button>
								<Button testId="primary" appearance="primary" onClick={close}>
									Close
								</Button>
							</ModalFooter>
						</Box>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
