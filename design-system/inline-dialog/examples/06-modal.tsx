import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import InlineDialog from '@atlaskit/inline-dialog/inline-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

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
