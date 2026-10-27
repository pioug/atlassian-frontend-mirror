import React from 'react';

import { FieldId } from './field-id-context';
import Message, { type StatusMessageProps } from './message';
import messageMotion from './message-motion-capability';

/**
 * __Valid message__
 *
 * A valid message is used to tell a user that the field input is valid. For example,
 * a helper message could be 'Nice one, this username is available'.
 *
 */
export const ValidMessage: ({ children, iconLabel, testId }: StatusMessageProps) => JSX.Element = ({
	children,
	iconLabel,
	testId,
}: StatusMessageProps) => (
	<FieldId.Consumer>
		{(fieldId) => (
			<Message
				appearance="valid"
				fieldId={fieldId ? `${fieldId}-valid` : undefined}
				iconLabel={iconLabel}
				testId={testId}
			>
				{children}
			</Message>
		)}
	</FieldId.Consumer>
);

messageMotion.mark(ValidMessage);
