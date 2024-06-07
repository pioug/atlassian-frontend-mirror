import React from 'react';

import { di } from 'react-magnetic-di';

import Button from '@atlaskit/button/new';
import Form, { ErrorMessage, FormSection } from '@atlaskit/form';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

import messages from '../common/messages';
import {
	type Ari,
	type SelectedRule,
	type SelectorOption,
	type UserInputPrompt,
	type UserInputs,
	UserInputType,
	type UserInputValue,
} from '../common/types';

import BooleanInputPrompt from './boolean-prompt/main';
import NumberInputPrompt from './number-prompt/main';
import ParagraphInputPrompt from './paragraph-prompt/main';
import SelectInputPrompt from './select-prompt/main';
import TextInputPrompt from './text-prompt/main';

export interface UserInputProps {
	selectedRule: SelectedRule;
	clearSelectedRule: () => any;
	invokeRule: (ruleId: number, objects: Ari[], userInputs?: UserInputs) => Promise<void>;

	onInputsModalOpened?: () => void;
	onInputsModalClosed?: () => void;
}

const UserInputForm = (props: UserInputProps) => {
	di(
		BooleanInputPrompt,
		Button,
		ErrorMessage,
		Form,
		FormSection,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		ModalTitle,
		NumberInputPrompt,
		SelectInputPrompt,
		TextInputPrompt,
	);

	const { selectedRule, clearSelectedRule, invokeRule, onInputsModalOpened, onInputsModalClosed } =
		props;
	const { rule, objects } = selectedRule;
	const { userInputPrompts } = rule;

	const getTypeOfInput = (key: string, prompts: UserInputPrompt[]) =>
		prompts.find(({ variableName }) => variableName === key)?.inputType;

	const generateInputValue = (inputType: UserInputType, data: any): UserInputValue => {
		switch (inputType) {
			case UserInputType.DROPDOWN:
				return {
					inputType,
					value: data ? (data as SelectorOption).value : '',
				};
			case UserInputType.NUMBER:
				return {
					inputType,
					value: Number(data),
				};
			default:
				return {
					inputType,
					value: data,
				};
		}
	};

	const handleSubmit = (data: Record<string, string>) => {
		const output = Object.entries(data).reduce((acc: UserInputs, [key, value]) => {
			const inputType = getTypeOfInput(key, userInputPrompts);

			if (!inputType) {
				return acc;
			}

			acc[key] = generateInputValue(inputType, value);

			return acc;
		}, {});

		return invokeRule(rule.id, objects, output);
	};

	const handleOpen = () => {
		if (onInputsModalOpened) {
			onInputsModalOpened();
		}
	};

	const handleClose = () => {
		clearSelectedRule();
		if (onInputsModalClosed) {
			onInputsModalClosed();
		}
	};

	const generateUserInputForm = (inputPrompt: UserInputPrompt) => {
		switch (inputPrompt.inputType) {
			case UserInputType.TEXT:
				return <TextInputPrompt key={inputPrompt.variableName} userInputPrompt={inputPrompt} />;
			case UserInputType.NUMBER:
				return <NumberInputPrompt key={inputPrompt.variableName} userInputPrompt={inputPrompt} />;
			case UserInputType.DROPDOWN:
				return <SelectInputPrompt key={inputPrompt.variableName} userInputPrompt={inputPrompt} />;
			case UserInputType.BOOLEAN:
				return <BooleanInputPrompt key={inputPrompt.variableName} userInputPrompt={inputPrompt} />;
			case UserInputType.PARAGRAPH:
				return (
					<ParagraphInputPrompt key={inputPrompt.variableName} userInputPrompt={inputPrompt} />
				);
			default:
				return (
					<>
						<br />
						<ErrorMessage>{messages.errorInputTypeIsNotSupported.defaultMessage}</ErrorMessage>
						<br />
					</>
				);
		}
	};

	return (
		<Modal
			data-testid="automation-platform.ui.manual-rules-container.manual-triggers-form.modal"
			onClose={handleClose}
			onOpenComplete={handleOpen}
		>
			<Form<Record<string, string>> onSubmit={handleSubmit}>
				{({ formProps, submitting }) => (
					<form {...formProps}>
						<ModalHeader>
							<ModalTitle>{rule.name}</ModalTitle>
						</ModalHeader>
						<ModalBody>
							{messages.inputRequiredForAction.defaultMessage}
							<FormSection>{userInputPrompts.map(generateUserInputForm)}</FormSection>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={handleClose} isDisabled={submitting}>
								{messages.cancelButtonTitle.defaultMessage}
							</Button>
							<Button appearance="primary" type="submit" isLoading={submitting} autoFocus>
								{messages.continueButtonTitle.defaultMessage}
							</Button>
						</ModalFooter>
					</form>
				)}
			</Form>
		</Modal>
	);
};

export default UserInputForm;
