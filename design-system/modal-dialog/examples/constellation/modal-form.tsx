import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import Textfield from '@atlaskit/textfield/text-field';

export default function Example(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState('');

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	const onSubmit = useCallback(
		(data: Record<string, any>) => {
			console.log(data);
			setName(data.name);
		},
		[setName],
	);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal}>
						<Form onSubmit={onSubmit} id="modal-form">
							<ModalHeader hasCloseButton>
								<ModalTitle>Create a user</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<Field
									id="name"
									name="name"
									label="Type your name to continue"
									defaultValue="Ian Atlas"
									helperMessage={name ? `Hello, ${name}` : ''}
									component={({ fieldProps }) => <Textfield {...fieldProps} />}
								/>
							</ModalBody>
							<ModalFooter>
								<Button appearance="subtle" onClick={closeModal}>
									Close
								</Button>
								<Button appearance="primary" type="submit">
									Create
								</Button>
							</ModalFooter>
						</Form>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
