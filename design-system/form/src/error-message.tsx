import React from 'react';

import { FieldId } from './field-id-context';
import Message, { type MessageProps } from './message';

/**
 * __Error message__
 *
 * An error message is used to tell a user that the field input is invalid. For example, an error message could be
 * 'Invalid username, needs to be more than 4 characters'.
 *
 */
export const ErrorMessage: ({ children, testId }: MessageProps) => JSX.Element = ({
	children,
	testId,
}: MessageProps) => (
	<FieldId.Consumer>
		{(fieldId) => (
			<Message
				appearance="error"
				fieldId={fieldId ? `${fieldId}-error` : undefined}
				testId={testId}
			>
				{children}
			</Message>
		)}
	</FieldId.Consumer>
);
