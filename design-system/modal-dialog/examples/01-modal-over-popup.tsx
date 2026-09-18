import React, { type FC, useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import PlaceholderContent from './placeholder-content';

const styles = cssMap({
	spacer: {
		marginBlockStart: token('space.100'),
		marginInlineEnd: token('space.100'),
		marginBlockEnd: token('space.100'),
		marginInlineStart: token('space.100'),
	},
	sizedContent: {
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
		alignItems: 'center',
		overflow: 'auto',
		textAlign: 'center',
		verticalAlign: 'center',
	},
});
const PopupContent: FC = () => {
	const [showModal, setShowModal] = useState(false);

	const open = useCallback(() => setShowModal(true), []);
	const close = useCallback(() => setShowModal(false), []);

	return (
		<Box xcss={styles.sizedContent}>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{showModal && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<PlaceholderContent count={2} />
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
		</Box>
	);
};

const PopupPlacementExample = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box xcss={styles.spacer}>
			<Popup
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent />}
				trigger={(triggerProps) => (
					<Button id="popup-trigger" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
			/>
		</Box>
	);
};

export default PopupPlacementExample;
