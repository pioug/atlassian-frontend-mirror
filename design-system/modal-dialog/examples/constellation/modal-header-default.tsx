import React, { Fragment, useCallback, useState } from 'react';

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
		<Fragment>
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
									<ModalTitle>Custom modal header</ModalTitle>
								</Flex>
							</Grid>
						</ModalHeader>
						<ModalBody>
							<p>
								If you wish to customise a modal dialog, it accepts any valid React element as
								children.
							</p>

							<p>
								Modal header accepts any valid React element as children, so you can use modal title
								in conjunction with other elements like an exit button in the top right.
							</p>

							<p>
								Modal footer accepts any valid React element as children. For example, you can add
								an avatar in the footer. For very custom use cases, you can achieve the same thing
								without modal footer.
							</p>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">About modals</Button>
							<Button appearance="primary" onClick={closeModal}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Fragment>
	);
}
