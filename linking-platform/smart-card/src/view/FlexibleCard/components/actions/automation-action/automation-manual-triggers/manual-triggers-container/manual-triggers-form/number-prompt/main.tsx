import React from 'react';

import { di } from 'react-magnetic-di';

import { ErrorMessage } from '@atlaskit/form/error-message';
import Field from '@atlaskit/form/field';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Textfield from '@atlaskit/textfield/text-field';

import messages from '../../common/messages';
import type { UserInputNumberPrompt } from '../../common/types';
import { numberValidate } from './numberValidate';

interface NumberInputPromptProps {
	userInputPrompt: UserInputNumberPrompt;
}

export enum Errors {
	EMPTY = 'EMPTY',
	INVALID_NUMBER = 'INVALID_NUMBER',
}

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
					{fg('platform_navx_3298_message_wrapper') ? (
						<MessageWrapper>{generateErrorMessage(error)}</MessageWrapper>
					) : (
						generateErrorMessage(error)
					)}
				</>
			)}
		</Field>
	);
};

export default NumberInputPrompt;
