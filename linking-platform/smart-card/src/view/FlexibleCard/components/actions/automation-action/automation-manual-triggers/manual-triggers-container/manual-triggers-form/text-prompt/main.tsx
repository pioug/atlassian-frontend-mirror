import React from 'react';

import { di } from 'react-magnetic-di';

import { ErrorMessage } from '@atlaskit/form/error-message';
import Field from '@atlaskit/form/field';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Textfield from '@atlaskit/textfield/text-field';

import messages from '../../common/messages';
import type { UserInputTextPrompt } from '../../common/types';

interface TextInputPromptProps {
	userInputPrompt: UserInputTextPrompt;
}

enum Errors {
	EMPTY = 'EMPTY',
}

const TextInputPrompt = ({ userInputPrompt }: TextInputPromptProps): React.JSX.Element => {
	di(ErrorMessage, Field, Textfield);

	const { variableName, required, displayName, defaultValue } = userInputPrompt;

	const validate = (value?: string): Errors | undefined =>
		required && !value ? Errors.EMPTY : undefined;

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
					<Textfield {...fieldProps} />
					{fg('platform_navx_3298_message_wrapper') ? (
						<MessageWrapper>
							{error === Errors.EMPTY && (
								<ErrorMessage>{messages.errorInputMustNotBeEmpty.defaultMessage}</ErrorMessage>
							)}
						</MessageWrapper>
					) : (
						error === Errors.EMPTY && (
							<ErrorMessage>{messages.errorInputMustNotBeEmpty.defaultMessage}</ErrorMessage>
						)
					)}
				</>
			)}
		</Field>
	);
};

export default TextInputPrompt;
