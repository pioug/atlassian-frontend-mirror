import React from 'react';

import Icon from '@atlaskit/icon/core/chevron-right';

import { type IconComponent } from '../../types';

export const NestedDropdownRightIcon: IconComponent = ({
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
