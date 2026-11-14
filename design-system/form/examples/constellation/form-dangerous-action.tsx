import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import { ErrorMessage } from '@atlaskit/form/error-message';
import Form from '@atlaskit/form/form';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Text } from '@atlaskit/primitives/compiled/text';

type DeleteWorkspaceFormValues = {
	confirmDeletion: boolean;
};

const Example = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	const close = () => setIsOpen(false);

	const handleSubmit = (data: DeleteWorkspaceFormValues) => {
		if (!data.confirmDeletion) {
			return {
				confirmDeletion: 'Select the checkbox to confirm that you want to delete this workspace.',
			};
		}

		window.alert('The workspace was deleted.');
		close();
	};

	return (
		<Fragment>
			<Button aria-haspopup="dialog" appearance="danger" onClick={() => setIsOpen(true)}>
				Delete workspace
			</Button>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close}>
						<Form onSubmit={handleSubmit} id="delete-workspace-form">
							<ModalHeader hasCloseButton>
								<ModalTitle appearance="danger">Delete workspace</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<Text as="p">This permanently deletes this workspace and all of its content.</Text>
								<CheckboxField isRequired name="confirmDeletion">
									{({ fieldProps, error }) => (
										<Fragment>
											<Checkbox
												{...fieldProps}
												isInvalid={Boolean(error)}
												label="I understand that this action cannot be undone."
											/>
											<MessageWrapper>
												{error && <ErrorMessage>{error}</ErrorMessage>}
											</MessageWrapper>
										</Fragment>
									)}
								</CheckboxField>
							</ModalBody>
							<ModalFooter>
								<Button appearance="subtle" onClick={close}>
									Cancel
								</Button>
								<Button appearance="danger" form="delete-workspace-form" type="submit">
									Delete workspace
								</Button>
							</ModalFooter>
						</Form>
					</ModalDialog>
				)}
			</ModalTransition>
		</Fragment>
	);
};

export default Example;
