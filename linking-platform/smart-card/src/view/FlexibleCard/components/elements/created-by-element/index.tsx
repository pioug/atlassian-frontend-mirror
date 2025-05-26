import React from 'react';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type CreatedByElementProps = BaseTextElementProps;

const CreatedByElement = (props: CreatedByElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toFormattedTextProps(messages.created_by, context.createdBy) : null;

	return data ? <BaseTextElement {...data} {...props} name={ElementName.CreatedBy} /> : null;
};

export default CreatedByElement;
