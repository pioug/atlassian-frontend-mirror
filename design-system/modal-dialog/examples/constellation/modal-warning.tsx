import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

export default function Example(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal}>
						<ModalHeader hasCloseButton>
							<ModalTitle appearance="warning">Move your page to the Design team space</ModalTitle>
						</ModalHeader>
						<ModalBody>
							If you move this page to the Design system space, your access permissions will change
							to view only. You'll need to ask the space admin for edit access.
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Cancel</Button>
							<Button appearance="warning" onClick={closeModal}>
								Move page
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
