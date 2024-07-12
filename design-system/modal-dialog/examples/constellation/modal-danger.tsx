import React, { useCallback, useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Flex, Grid, xcss } from '@atlaskit/primitives';

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '../../src';

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
								<Flex xcss={closeContainerStyles} justifyContent="end">
									<IconButton
										appearance="subtle"
										icon={CrossIcon}
										label="Close Modal"
										onClick={closeModal}
									/>
								</Flex>
								<Flex xcss={titleContainerStyles} justifyContent="start">
									<ModalTitle appearance="danger">You’re about to delete this page</ModalTitle>
								</Flex>
							</Grid>
						</ModalHeader>
						<ModalBody>
							<p>Before you delete it permanently, there’s some things you should know:</p>
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
