import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '../src';

import ModalTitleWithClose from './common/modal-title';

const customContainerStyles = xcss({
	display: 'flex',
	height: '700px',
	flex: '1 1 auto',
	flexDirection: 'column',
	background: token('color.background.warning'),
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
						<Box xcss={customContainerStyles} testId="custom-container">
							<ModalHeader>
								<ModalTitleWithClose onClose={close}>
									<ModalTitle>Modal Title</ModalTitle>
								</ModalTitleWithClose>
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
