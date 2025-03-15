import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Modal, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex, Grid, xcss } from '@atlaskit/primitives';

const gridStyles = xcss({
	width: '100%',
});

const closeContainerStyles = xcss({
	gridArea: 'close',
});

const titleContainerStyles = xcss({
	gridArea: 'title',
});

export default function Example() {
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
						<ModalHeader>
							<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
								<Flex xcss={titleContainerStyles} justifyContent="start">
									<ModalTitle appearance="warning">
										Move your page to the Design team space
									</ModalTitle>
								</Flex>
								<Flex xcss={closeContainerStyles} justifyContent="end">
									<CloseButton onClick={closeModal} />
								</Flex>
							</Grid>
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
