import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, BaseBadgeElementProps, toBadgeProps } from '../common';

export type ViewCountElementProps = BaseBadgeElementProps;

const ViewCountElement = (props: ViewCountElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.viewCount?.toString()) : null;

	return data ? (
		<BaseBadgeElement icon={IconType.View} {...data} {...props} name={ElementName.ViewCount} />
	) : null;
};

export default ViewCountElement;
