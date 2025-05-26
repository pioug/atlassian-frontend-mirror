import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type ReactCountElementProps = BaseBadgeElementProps;

const ReactCountElement = (props: ReactCountElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.reactCount?.toString()) : null;

	return data ? (
		<BaseBadgeElement icon={IconType.React} {...data} {...props} name={ElementName.ReactCount} />
	) : null;
};

export default ReactCountElement;
