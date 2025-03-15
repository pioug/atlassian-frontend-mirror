import React, { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, HelperMessage } from '@atlaskit/form';
import Modal, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex, Grid, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

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
									<ModalHeader>
										<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
											<Flex xcss={titleContainerStyles} justifyContent="start">
												<ModalTitle>Create a user</ModalTitle>
											</Flex>
											<Flex xcss={closeContainerStyles} justifyContent="end">
												<CloseButton onClick={closeModal} />
											</Flex>
										</Grid>
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
