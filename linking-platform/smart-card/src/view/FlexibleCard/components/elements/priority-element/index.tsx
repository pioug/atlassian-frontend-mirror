import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps } from '../common';

export type PriorityElementProps = BaseBadgeElementProps;

const PriorityElement = (props: PriorityElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context?.priority ?? null;

	return data ? <BaseBadgeElement {...data} {...props} name={ElementName.Priority} /> : null;
};

export default PriorityElement;
