import React from 'react';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type ModifiedByElementProps = BaseTextElementProps;

const ModifiedByElement = (props: ModifiedByElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toFormattedTextProps(messages.modified_by, context.modifiedBy) : null;

	return data ? <BaseTextElement {...data} {...props} name={ElementName.ModifiedBy} /> : null;
};

export default ModifiedByElement;
