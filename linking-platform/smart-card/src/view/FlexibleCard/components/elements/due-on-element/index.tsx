import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseLozengeElement, type BaseLozengeElementProps, toDateLozengeProps } from '../common';

export type DueOnElementProps = BaseLozengeElementProps;

const DueOnElement = (props: DueOnElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toDateLozengeProps(context.dueOn) : null;

	return data ? <BaseLozengeElement {...data} {...props} name={ElementName.DueOn} /> : null;
};

export default DueOnElement;
