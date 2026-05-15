import React from 'react';

import { FieldId } from './field-id-context';
import Message, { type MessageProps } from './message';

/**
 * __Valid message__
 *
 * A valid message is used to tell a user that the field input is valid. For example,
 * a helper message could be 'Nice one, this username is available'.
 *
 */
export const ValidMessage: ({ children, testId }: MessageProps) => JSX.Element = ({
	children,
	testId,
}: MessageProps) => (
	<FieldId.Consumer>
		{(fieldId) => (
			<Message
				appearance="valid"
				fieldId={fieldId ? `${fieldId}-valid` : undefined}
				testId={testId}
			>
				{children}
			</Message>
		)}
	</FieldId.Consumer>
);
