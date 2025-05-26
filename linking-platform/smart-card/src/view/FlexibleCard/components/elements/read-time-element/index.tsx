import React from 'react';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type ReadTimeElementProps = BaseTextElementProps;

const ReadTimeElement = (props: ReadTimeElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toFormattedTextProps(messages.read_time, context.readTime) : null;

	return data ? <BaseTextElement {...data} {...props} name={ElementName.ReadTime} /> : null;
};

export default ReadTimeElement;
