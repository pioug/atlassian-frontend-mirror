import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import InlineDialog from '@atlaskit/inline-dialog';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

export default (): React.JSX.Element => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const open = () => setIsOpen(true);
	const close = () => {
		console.log('closed');
		setIsOpen(false);
	};
	const secondaryAction = () => console.log('Secondary button has been clicked!');

	return (
		<div data-testid="outside-modal">
			<InlineDialog
				onClose={() => {
					console.log('inline dialog closed');
					setIsDialogOpen(false);
				}}
				isOpen={isDialogOpen}
				content={
					<div>
						<Button onClick={open} testId="open-modal-button">
							Open Modal
						</Button>

						<ModalTransition>
							{isOpen && (
								<Modal onClose={close} testId="modal">
									<ModalHeader hasCloseButton>
										<ModalTitle>Modal Title</ModalTitle>
									</ModalHeader>
									<ModalBody>This is inside the modal body.</ModalBody>
									<ModalFooter>
										<Button testId="secondary" appearance="subtle" onClickCapture={secondaryAction}>
											Secondary Action
										</Button>
										<Button testId="primary" appearance="primary" onClick={close}>
											Close
										</Button>
									</ModalFooter>
								</Modal>
							)}
						</ModalTransition>
					</div>
				}
				testId="inline-dialog"
			>
				<Button testId="open-inline-dialog-button" onClick={() => setIsDialogOpen(true)}>
					Open Dialog
				</Button>
			</InlineDialog>
		</div>
	);
};
