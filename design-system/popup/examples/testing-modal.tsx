import React, { type FC, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Modal, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const wrapperStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
});

const modalStyles = cssMap({
	root: {
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
	},
});

type PopupProps = {
	shouldRenderToParent?: boolean;
};

const ModalDialog = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<Box xcss={wrapperStyles.root}>
			<Button>Button 1</Button>
			<Button>Button 2</Button>
			<Button onClick={() => setShowModal(true)}>Show modal</Button>
			{showModal && (
				<Modal
					onClose={() => {
						setShowModal(false);
					}}
				>
					<ModalHeader hasCloseButton>
						<ModalTitle>Modal</ModalTitle>
					</ModalHeader>
					<Box xcss={modalStyles.root}>
						<h1>Form</h1>
						<p>Clicking inside a modal does not cause the modal or popup to close</p>
						<p>Clicking outside or pressing the Escape key closes only the modal dialog</p>
						<input type="text" />
					</Box>
				</Modal>
			)}
		</Box>
	);
};

const Example: FC<PopupProps> = ({ shouldRenderToParent }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom"
				content={() => <ModalDialog />}
				shouldRenderToParent={shouldRenderToParent}
				trigger={(triggerProps) => (
					<Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} popup{' '}
					</Button>
				)}
			/>
		</div>
	);
};

export default Example;
