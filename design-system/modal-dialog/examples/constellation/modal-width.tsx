import React, { useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

export default function Example(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [width, setWidth] = useState('medium');

	const closeModal = useCallback(() => setIsOpen(false), [setIsOpen]);
	const setWidthAndOpen = useCallback(
		(newWidth: string) => {
			setWidth(newWidth);
			requestAnimationFrame(() => setIsOpen(true));
		},
		[setWidth, setIsOpen],
	);

	return (
		<>
			<ButtonGroup label="Choose modal width">
				<Button
					aria-haspopup="dialog"
					appearance="primary"
					onClick={() => setWidthAndOpen('small')}
				>
					small
				</Button>
				<Button
					aria-haspopup="dialog"
					appearance="primary"
					onClick={() => setWidthAndOpen('medium')}
				>
					medium
				</Button>
				<Button
					aria-haspopup="dialog"
					appearance="primary"
					onClick={() => setWidthAndOpen('large')}
				>
					large
				</Button>
				<Button
					aria-haspopup="dialog"
					appearance="primary"
					onClick={() => setWidthAndOpen('x-large')}
				>
					x-large
				</Button>
			</ButtonGroup>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal} width={width}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Set up your own projects</ModalTitle>
						</ModalHeader>
						<ModalBody>
							We simplified the way you set up work items, workflows, fields, and screens. Check out
							the new, independent project experience to see it in action.
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Skip</Button>
							<Button appearance="primary" onClick={closeModal}>
								Get started
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
