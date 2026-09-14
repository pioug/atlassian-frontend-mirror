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
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import RadioGroup from '@atlaskit/radio/radio-group';
import Textfield from '@atlaskit/textfield/text-field';

export default function ModalDialogForm(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);
	const [data, setData]: [
		{
			name?: string;
			email?: string;
			checkbox?: boolean;
			radiogroup?: string;
		},
		Function,
	] = useState({});
	const onFormSubmit = (data: any) => {
		setData(data);
		close();
	};

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Form Demo</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Form onSubmit={onFormSubmit} id="modal-form">
								<Text as="p">Enter some text then submit the form to see the response.</Text>

								<Field
									label="Name"
									name="name"
									defaultValue=""
									isRequired={true}
									component={({ fieldProps }) => <Textfield {...fieldProps} />}
								></Field>

								<Field
									label="Email"
									name="email"
									defaultValue=""
									isRequired={true}
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
							</Form>
						</ModalBody>
						<ModalFooter>
							<Button appearance="primary" type="submit" form="modal-form">
								Submit
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
			<Stack>
				<Box as="span">{data.name && `Name: ${data.name}`}</Box>
				<Box as="span">{data.email && `Email: ${data.email}`}</Box>
				<Box as="span">{data.checkbox && `Checkbox: ${data.checkbox}`}</Box>
				<Box as="span">{data.radiogroup && `Radio Group: ${data.radiogroup}`}</Box>
			</Stack>
		</>
	);
}
