import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { SplitButton } from '@atlaskit/button/split-button/split-button';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<SplitButton appearance="primary">
			<Button onClick={() => setIsOpen(true)}>
				Open modal{' '}
				<ModalTransition>
					{isOpen && (
						<Modal onClose={() => setIsOpen(true)}>
							<ModalHeader hasCloseButton>
								<ModalTitle>Call to action</ModalTitle>
							</ModalHeader>
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
