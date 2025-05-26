import React from 'react';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type AssignedToElementProps = BaseTextElementProps;

const AssignedToElement = (props: AssignedToElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toFormattedTextProps(messages.assigned_to, context.assignedTo) : null;
	return data ? <BaseTextElement {...data} {...props} name={ElementName.AssignedTo} /> : null;
};

export default AssignedToElement;
