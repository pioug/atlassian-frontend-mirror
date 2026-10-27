import React from 'react';

import { FieldId } from './field-id-context';
import Message, { type StatusMessageProps } from './message';
import messageMotion from './message-motion-capability';

/**
 * __Error message__
 *
 * An error message is used to tell a user that the field input is invalid. For example, an error message could be
 * 'Invalid username, needs to be more than 4 characters'.
 *
 */
export const ErrorMessage: ({ children, iconLabel, testId }: StatusMessageProps) => JSX.Element = ({
	children,
	iconLabel,
	testId,
}: StatusMessageProps) => (
	<FieldId.Consumer>
		{(fieldId) => (
			<Message
				appearance="error"
				fieldId={fieldId ? `${fieldId}-error` : undefined}
				iconLabel={iconLabel}
				testId={testId}
			>
				{children}
			</Message>
		)}
	</FieldId.Consumer>
);

messageMotion.mark(ErrorMessage);
