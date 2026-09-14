import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import Form from '@atlaskit/form/form';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import Field from '@atlaskit/form/field';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import RadioGroup from '@atlaskit/radio/radio-group';
import Textfield from '@atlaskit/textfield/text-field';

export default function ModalDialogForm(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return (
		<>
			<Button onClick={open}>Open Modal</Button>

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
								<ModalTitle>Modal dialog with form</ModalTitle>
							</ModalHeader>

							<ModalBody>
								<p>Enter some text then submit the form to see the response.</p>

								<Field
									label="Name"
									name="my-name"
									defaultValue=""
									component={({ fieldProps }) => <Textfield autoComplete="name" {...fieldProps} />}
								/>

								<Field
									label="Email"
									name="my-email"
									defaultValue=""
									component={({ fieldProps }) => (
										<Textfield
											autoComplete="email"
											placeholder="charlie@atlassian.com"
											{...fieldProps}
										/>
									)}
								/>

								<CheckboxField name="remember" defaultIsChecked>
									{({ fieldProps }) => (
										<Checkbox {...fieldProps} label="Always sign in on this device" />
									)}
								</CheckboxField>

								<Field
									name="radiogroup"
									label="Colors"
									defaultValue=""
									component={({ fieldProps: { value, ...others } }) => (
										<RadioGroup
											options={[
												{ name: 'color', value: 'red', label: 'Red' },
												{ name: 'color', value: 'blue', label: 'Blue' },
												{ name: 'color', value: 'yellow', label: 'Yellow' },
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
									Submit
								</Button>
							</ModalFooter>
						</Form>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
}
