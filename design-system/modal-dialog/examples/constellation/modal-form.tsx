import React, { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, HelperMessage } from '@atlaskit/form';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import Textfield from '@atlaskit/textfield';

export default function Example() {
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
						<Form onSubmit={onSubmit}>
							{({ formProps }) => (
								<form {...formProps} id="modal-form">
									<ModalHeader hasCloseButton>
										<ModalTitle>Create a user</ModalTitle>
									</ModalHeader>
									<ModalBody>
										<Field
											id="name"
											name="name"
											label="Type your name to continue"
											defaultValue="Ian Atlas"
										>
											{({ fieldProps }) => (
												<Fragment>
													<Textfield {...fieldProps} />
													<HelperMessage>{name ? `Hello, ${name}` : ''}</HelperMessage>
												</Fragment>
											)}
										</Field>
									</ModalBody>
									<ModalFooter>
										<Button appearance="subtle" onClick={closeModal}>
											Close
										</Button>
										<Button appearance="primary" type="submit">
											Create
										</Button>
									</ModalFooter>
								</form>
							)}
						</Form>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
