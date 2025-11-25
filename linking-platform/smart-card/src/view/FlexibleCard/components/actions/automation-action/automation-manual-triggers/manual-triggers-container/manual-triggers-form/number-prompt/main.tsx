import React from 'react';

import { di } from 'react-magnetic-di';

import { ErrorMessage, Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import messages from '../../common/messages';
import type { UserInputNumberPrompt } from '../../common/types';

interface NumberInputPromptProps {
	userInputPrompt: UserInputNumberPrompt;
}

export enum Errors {
	EMPTY = 'EMPTY',
	INVALID_NUMBER = 'INVALID_NUMBER',
}

export const numberValidate = (isRequired: boolean, value?: string) => {
	if (isRequired && !value) {
		return Errors.EMPTY;
	}

	if (value && Number.isNaN(Number(value))) {
		return Errors.INVALID_NUMBER;
	}

	return undefined;
};

const NumberInputPrompt = ({ userInputPrompt }: NumberInputPromptProps): React.JSX.Element => {
	di(ErrorMessage, Field, Textfield);

	const { variableName, required, displayName, defaultValue } = userInputPrompt;

	const generateErrorMessage = (error?: string) => {
		switch (error) {
			case Errors.EMPTY:
				return <ErrorMessage>{messages.errorInputMustNotBeEmpty.defaultMessage}</ErrorMessage>;
			case Errors.INVALID_NUMBER:
				return <ErrorMessage>{messages.errorValueIsNotValidNumber.defaultMessage}</ErrorMessage>;
			default:
				return null;
		}
	};

	return (
		<Field
			key={variableName}
			name={variableName}
			label={displayName}
			defaultValue={defaultValue}
			isRequired={required}
			validate={(value) => numberValidate(required, value)}
		>
			{({ fieldProps, error }) => (
				<>
					<Textfield {...fieldProps} />
					{generateErrorMessage(error)}
				</>
			)}
		</Field>
	);
};

export default NumberInputPrompt;
