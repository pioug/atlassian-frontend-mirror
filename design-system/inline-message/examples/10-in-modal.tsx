import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import InlineMessage from '@atlaskit/inline-message';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const open = () => setIsOpen(true);
	const close = () => {
		console.log('closed');
		setIsOpen(false);
	};
	return (
		<div>
			<div>
				<Button onClick={open} testId="open-modal-button">
					Open Modal
				</Button>
			</div>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<InlineMessage title="Inline Message Title Example" secondaryText="Secondary Text">
								<p>Primary and secondary text dialog</p>
							</InlineMessage>
							<br />
							<InlineMessage title="Inline Message Title Only">
								<p>Title only dialog</p>
							</InlineMessage>
							<br />
							<InlineMessage secondaryText="Secondary Text Only">
								<p>Secondary text only dialog</p>
							</InlineMessage>
							<br />
							<InlineMessage title="Display Message Beside Text" placement="right-end">
								<p>Dialog beside text</p>
							</InlineMessage>
						</ModalBody>
						<ModalFooter>
							<Button testId="secondary" appearance="subtle">
								Secondary Action
							</Button>
							<Button testId="primary" appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
};
