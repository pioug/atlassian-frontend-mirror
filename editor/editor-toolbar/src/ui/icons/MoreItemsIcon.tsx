import React from 'react';

import Icon from '@atlaskit/icon/core/chevron-down';

import { type IconComponent } from '../../types';

export const MoreItemsIcon: IconComponent = ({
	label,
	testId,
	color,
	shouldRecommendSmallIcon,
	spacing,
}) => (
	<Icon
		label={label}
		testId={testId}
		color={color}
		shouldRecommendSmallIcon={shouldRecommendSmallIcon}
		spacing={spacing}
		size="small"
	/>
);
