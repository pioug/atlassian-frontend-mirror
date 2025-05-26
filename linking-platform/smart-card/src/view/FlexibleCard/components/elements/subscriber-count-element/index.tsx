import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type SubscriberCountElementProps = BaseBadgeElementProps;

const SubscriberCountElement = (props: SubscriberCountElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.subscriberCount?.toString()) : null;

	return data ? (
		<BaseBadgeElement
			icon={IconType.Subscriber}
			{...data}
			{...props}
			name={ElementName.SubscriberCount}
		/>
	) : null;
};

export default SubscriberCountElement;
