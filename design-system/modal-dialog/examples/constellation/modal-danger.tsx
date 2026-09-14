import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Text } from '@atlaskit/primitives/compiled';

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
							<ModalTitle appearance="danger">You’re about to delete this page</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Text as="p">
								Before you delete it permanently, there’s some things you should know:
							</Text>
							<ul>
								<li>4 pages have links to this page that will break</li>
								<li>2 child pages will be left behind in the page tree</li>
							</ul>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Cancel</Button>
							<Button appearance="danger" onClick={closeModal}>
								Delete
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
