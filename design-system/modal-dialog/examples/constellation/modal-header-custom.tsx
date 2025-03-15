import React, { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import Modal, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalTransition,
	useModal,
} from '@atlaskit/modal-dialog';
import { Box, xcss } from '@atlaskit/primitives';

const headerStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
});

const CustomHeader = () => {
	const { onClose, titleId } = useModal();
	return (
		<Box xcss={headerStyles} padding="space.300">
			<Heading as="h1" size="medium" id={titleId}>
				Custom modal header
			</Heading>
			<CloseButton onClick={onClose} />
		</Box>
	);
};

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
						<CustomHeader />
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
