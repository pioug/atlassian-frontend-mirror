import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseLozengeElement, type BaseLozengeElementProps } from '../common';

export type StateElementProps = BaseLozengeElementProps;

const StateElement = (props: StateElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context?.state ?? null;

	return data ? <BaseLozengeElement {...data} {...props} name={ElementName.State} /> : null;
};

export default StateElement;
