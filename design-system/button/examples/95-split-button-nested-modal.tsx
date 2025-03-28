import React, { useState } from 'react';

import Button, { SplitButton } from '@atlaskit/button/new';
import Modal, { ModalBody, ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';

export default () => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<SplitButton appearance="primary">
			<Button onClick={() => setIsOpen(true)}>
				Open modal{' '}
				<ModalTransition>
					{isOpen && (
						<Modal onClose={() => setIsOpen(true)}>
							<ModalBody>Call to action buttons below should be neutral grey (not blue)</ModalBody>
							<ModalFooter>
								<Button onClick={() => setIsOpen(false)}>Cancel</Button>
								<Button onClick={() => setIsOpen(false)}>Duplicate</Button>
							</ModalFooter>
						</Modal>
					)}
				</ModalTransition>
			</Button>
			<Button>{isOpen.toString()}</Button>
		</SplitButton>
	);
};
