import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Code from '@atlaskit/code/code';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Text } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select/default';
import type { OptionType as Option, ValueType as Value } from '@atlaskit/select/types';

export default function ModalDialogSelect(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [country, setCountry] = useState<Option>();

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	const onSubmit = useCallback(
		(data: Record<string, any>) => {
			console.log(data);
			setCountry(data.country);
			closeModal();
		},
		[closeModal, setCountry],
	);

	return (
		<>
			<Button
				aria-haspopup="dialog"
				appearance="primary"
				onClick={openModal}
				testId="modal-trigger"
			>
				Open Modal
			</Button>
			<Text as="p">
				{country
					? `The selected country is '${country.label}'.`
					: 'No country has been selected yet.'}
			</Text>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={closeModal} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Using select in a modal dialog</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Text as="p">
								This select should open and be visible on top of the modal dialog. This is because
								of the usage of <Code>menuPosition="fixed"</Code> on <Code>@atlaskit/select</Code>.
							</Text>
							<Form onSubmit={onSubmit} id="modal-form">
								<Field<Value<Option, true>>
									name="country"
									label="Country of residence"
									component={({ fieldProps }) => (
										<Select<Option, true>
											{...fieldProps}
											menuPosition="fixed"
											options={[
												{ label: 'Adelaide', value: 'adelaide' },
												{ label: 'Brisbane', value: 'brisbane' },
												{ label: 'Canberra', value: 'canberra' },
												{ label: 'Darwin', value: 'darwin' },
												{ label: 'Hobart', value: 'hobart' },
												{ label: 'Melbourne', value: 'melbourne' },
												{ label: 'Perth', value: 'perth' },
												{ label: 'Sydney', value: 'sydney' },
											]}
										/>
									)}
								></Field>
							</Form>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={closeModal}>
								Close
							</Button>
							<Button appearance="primary" type="submit" form="modal-form">
								Submit
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
}
