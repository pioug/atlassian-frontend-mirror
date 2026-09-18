import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box } from '@atlaskit/primitives/compiled';

import PlaceholderContent from './placeholder-content';

const customContainerStyles = cssMap({
	root: {
		display: 'flex',
		height: '700px',
		flex: '1 1 auto',
		flexDirection: 'column',
	},
});

export default function DefaultModal(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const secondaryAction = useCallback(() => alert('Secondary button has been clicked!'), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<Box
							xcss={customContainerStyles.root}
							backgroundColor="color.background.warning"
							testId="custom-container"
						>
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<PlaceholderContent count={2} />
							</ModalBody>
							<ModalFooter>
								<Button testId="secondary" appearance="subtle" onClick={secondaryAction}>
									Secondary Action
								</Button>
								<Button testId="primary" appearance="primary" onClick={close}>
									Close
								</Button>
							</ModalFooter>
						</Box>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
