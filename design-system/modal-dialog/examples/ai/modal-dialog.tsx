import React from 'react';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

export default () => {
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<Button onClick={() => setOpen(true)}>Open Modal</Button>
			<ModalTransition>
				{open && (
					<Modal onClose={() => setOpen(false)}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Basic Modal</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<p>This is a simple modal dialog with basic content.</p>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Cancel</Button>
							<Button appearance="primary">Confirm</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</React.Fragment>
	);
};
