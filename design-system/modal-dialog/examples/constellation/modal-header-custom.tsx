import React, { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { CloseButton } from '@atlaskit/modal-dialog/close-button';
import { useModal } from '@atlaskit/modal-dialog/hooks';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';

const styles = cssMap({
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row-reverse',
	},
});

const CustomHeader = () => {
	const { onClose, titleId } = useModal();
	return (
		<Box xcss={styles.header} padding="space.300">
			{/* We have the close button first in the DOM and then are reversing it
			using the flex styles to ensure that it is focused as the first
			interactive element in the modal, *before* any other relevant content
			inside the modal. This ensures users of assistive technology get all
			relevant content. */}
			<CloseButton onClick={onClose} />
			<Heading as="h1" size="medium" id={titleId}>
				Custom modal header
			</Heading>
		</Box>
	);
};

export default function Example(): React.JSX.Element {
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
					// This is fixed in the custom header
					// eslint-disable-next-line @atlaskit/design-system/use-modal-dialog-close-button
					<Modal onClose={closeModal}>
						<CustomHeader />
						<ModalBody>
							<Text as="p">
								If you wish to customise a modal dialog, it accepts any valid React element as
								children.
							</Text>

							<Text as="p">
								Modal header accepts any valid React element as children, so you can use modal title
								in conjunction with other elements like an exit button in the top right.
							</Text>

							<Text as="p">
								Modal footer accepts any valid React element as children. For example, you can add
								an avatar in the footer. For very custom use cases, you can achieve the same thing
								without modal footer.
							</Text>
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
