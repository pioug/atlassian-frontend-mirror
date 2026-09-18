import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

import PlaceholderContent from './placeholder-content';

/**
 * Example for Playwright: background focusables + modal to verify native `showModal()` inertness.
 */
export default function ModalA11yBackgroundInert(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button testId="modal-background-control" appearance="default">
				Background button
			</Button>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<PlaceholderContent count={1} />
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
		</>
	);
}
