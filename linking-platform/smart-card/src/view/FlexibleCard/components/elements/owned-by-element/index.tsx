import React from 'react';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type OwnedByElementProps = BaseTextElementProps;

const OwnedByElement = (props: OwnedByElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toFormattedTextProps(messages.owned_by, context.ownedBy) : null;

	return data ? <BaseTextElement {...data} {...props} name={ElementName.OwnedBy} /> : null;
};

export default OwnedByElement;
