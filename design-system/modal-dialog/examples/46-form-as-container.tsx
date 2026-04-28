import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, Field } from '@atlaskit/form';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import Textfield from '@atlaskit/textfield';

export default function FormAsContainer(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const onFormSubmit = useCallback((data: any) => alert(JSON.stringify(data, null, 4)), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close} testId="modal">
						<Form onSubmit={onFormSubmit} id="modal-form">
							<ModalHeader hasCloseButton>
								<ModalTitle>Form as Container Demo</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<Text as="p">
									This is an example where the form is wrapped around <Text as="strong">all</Text>{' '}
									modal contents, <Text as="strong">including</Text> the header and footer. Enter
									some text then submit the form to see the response.
								</Text>

								<Field
									label="Name"
									name="my-name"
									defaultValue=""
									component={({ fieldProps }) => <Textfield {...fieldProps} />}
								></Field>

								<Field
									label="Email"
									name="my-email"
									defaultValue=""
									component={({ fieldProps }) => <Textfield autoComplete="off" {...fieldProps} />}
								></Field>

								<CheckboxField name="checkbox" defaultIsChecked>
									{({ fieldProps }) => (
										<Checkbox {...fieldProps} value="example" label="Checkbox" />
									)}
								</CheckboxField>

								<Field
									name="radiogroup"
									defaultValue=""
									label="Basic Radio Group Example"
									component={({ fieldProps }) => (
										<RadioGroup
											options={[
												{ name: 'color', value: 'red', label: 'Red' },
												{ name: 'color', value: 'blue', label: 'Blue' },
												{ name: 'color', value: 'yellow', label: 'Yellow' },
											]}
											{...fieldProps}
										/>
									)}
								></Field>
							</ModalBody>
							<ModalFooter>
								<Button appearance="primary" type="submit" form="modal-form">
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
