import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import RadioGroup from '@atlaskit/radio/radio-group';
import Textfield from '@atlaskit/textfield/text-field';

const FormModalDialogExample = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return (
		<>
			<Button onClick={open}>Open modal</Button>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close}>
						<Form
							onSubmit={(value) =>
								window.alert(`You submitted:\n${JSON.stringify(value, undefined, 2)}`)
							}
							id="form-with-id"
						>
							<ModalHeader hasCloseButton>
								<ModalTitle>Add permissions</ModalTitle>
							</ModalHeader>

							<ModalBody>
								<Field
									label="Name"
									name="my-name"
									defaultValue=""
									component={({ fieldProps }) => <Textfield {...fieldProps} />}
								/>

								<Field
									label="Email"
									name="my-email"
									defaultValue=""
									component={({ fieldProps }) => <Textfield autoComplete="off" {...fieldProps} />}
								/>

								<Field
									name="permission"
									label="Permissions"
									defaultValue=""
									component={({ fieldProps: { value, ...others } }) => (
										<RadioGroup
											options={[
												{ name: 'permission', value: 'view-only', label: 'View only' },
												{ name: 'permission', value: 'edit', label: 'Edit access' },
												{ name: 'permission', value: 'admin', label: 'Admin' },
											]}
											{...others}
										/>
									)}
								/>
							</ModalBody>
							<ModalFooter>
								<Button onClick={close} appearance="subtle">
									Cancel
								</Button>
								<Button type="submit" form="form-with-id" appearance="primary">
									Add
								</Button>
							</ModalFooter>
						</Form>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
};

export default FormModalDialogExample;
