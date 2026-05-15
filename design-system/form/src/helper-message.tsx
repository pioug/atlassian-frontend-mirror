import React from 'react';

import { FieldId } from './field-id-context';
import Message, { type MessageProps } from './message';

/**
 * __Helper message__
 *
 * A helper message tells the user what kind of input the field takes. For example, a helper message could be
 * 'Password should be more than 4 characters'
 *
 */
export const HelperMessage: ({ children, testId }: MessageProps) => JSX.Element = ({
	children,
	testId,
}: MessageProps) => (
	<FieldId.Consumer>
		{(fieldId) => (
			<Message fieldId={fieldId ? `${fieldId}-helper` : undefined} testId={testId}>
				{children}
			</Message>
		)}
	</FieldId.Consumer>
);
