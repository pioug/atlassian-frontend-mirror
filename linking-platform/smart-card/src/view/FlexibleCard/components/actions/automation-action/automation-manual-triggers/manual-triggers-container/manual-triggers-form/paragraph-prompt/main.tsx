import React from 'react';

import { di } from 'react-magnetic-di';

import { ErrorMessage, Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

import messages from '../../common/messages';
import type { UserInputParagraphPrompt } from '../../common/types';

interface ParagraphInputPromptProps {
	userInputPrompt: UserInputParagraphPrompt;
}

enum Errors {
	EMPTY = 'EMPTY',
	CHARACTER_LIMIT = 'CHARACTER_LIMIT',
}

const MAX_PARAGRAPH_CHARACTER_LIMIT = 5000;

const ParagraphInputPrompt = ({
	userInputPrompt,
}: ParagraphInputPromptProps): React.JSX.Element => {
	di(ErrorMessage, Field, TextArea);

	const { variableName, required, displayName, defaultValue } = userInputPrompt;

	const validate = (value?: string): Errors | undefined => {
		if (required && !value) {
			return Errors.EMPTY;
		}
		if (value && value?.trim().length === 0) {
			return Errors.EMPTY;
		}
		if (value && value.length > MAX_PARAGRAPH_CHARACTER_LIMIT) {
			return Errors.CHARACTER_LIMIT;
		}
		return undefined;
	};

	return (
		<Field
			name={variableName}
			label={displayName}
			defaultValue={defaultValue}
			isRequired={required}
			validate={validate}
		>
			{({ fieldProps, error }) => (
				<>
					{/* @ts-expect-error Type 'ChangeEvent<HTMLTextAreaElement>' is not assignable to type 'FormEvent<HTMLInputElement>'. */}
					<TextArea {...fieldProps} />
					{error === Errors.EMPTY && (
						<ErrorMessage>{messages.errorInputMustNotBeEmpty.defaultMessage}</ErrorMessage>
					)}
					{error === Errors.CHARACTER_LIMIT && (
						<ErrorMessage>{messages.errorInputCharacterLimitReached.defaultMessage}</ErrorMessage>
					)}
				</>
			)}
		</Field>
	);
};

export default ParagraphInputPrompt;
