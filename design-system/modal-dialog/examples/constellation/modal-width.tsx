import React, { useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '../../src';

export default function Example() {
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
				<Button appearance="primary" onClick={() => setWidthAndOpen('small')}>
					small
				</Button>
				<Button appearance="primary" onClick={() => setWidthAndOpen('medium')}>
					medium
				</Button>
				<Button appearance="primary" onClick={() => setWidthAndOpen('large')}>
					large
				</Button>
				<Button appearance="primary" onClick={() => setWidthAndOpen('x-large')}>
					x-large
				</Button>
			</ButtonGroup>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal} width={width}>
						<ModalHeader>
							<ModalTitle>Set up your own projects</ModalTitle>
						</ModalHeader>
						<ModalBody>
							We simplified the way you set up issue types, workflows, fields, and screens. Check
							out the new, independent project experience to see it in action.
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
