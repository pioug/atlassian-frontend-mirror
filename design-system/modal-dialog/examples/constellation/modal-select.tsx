import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import Form, { Field } from '@atlaskit/form';
import ModalDialog, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex, Grid, xcss } from '@atlaskit/primitives';
import Select, { OptionType as Option, ValueType as Value } from '@atlaskit/select';

const gridStyles = xcss({
	width: '100%',
});

const closeContainerStyles = xcss({
	gridArea: 'close',
});

const titleContainerStyles = xcss({
	gridArea: 'title',
});

export default function ModalDialogSelect() {
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
			<p>
				{country
					? `The country selected is '${country.label}'.`
					: 'No country has been selected yet.'}
			</p>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={closeModal} testId="modal">
						<ModalHeader>
							<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
								<Flex xcss={titleContainerStyles} justifyContent="start">
									<ModalTitle>Using select in a modal dialog</ModalTitle>
								</Flex>
								<Flex xcss={closeContainerStyles} justifyContent="end">
									<CloseButton onClick={closeModal} />
								</Flex>
							</Grid>
						</ModalHeader>
						<ModalBody>
							<p>
								This select should open and be visible on top of the modal dialog. This is because
								of the usage of <Code>menuPosition="fixed"</Code> on <Code>@atlaskit/select</Code>.
							</p>
							<Form onSubmit={onSubmit}>
								{({ formProps }) => (
									<form {...formProps} id="modal-form">
										<Field<Value<Option, true>> name="country" label="Country of residence">
											{({ fieldProps }) => (
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
										</Field>
									</form>
								)}
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
