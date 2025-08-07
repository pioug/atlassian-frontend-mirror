import React from 'react';

import Icon from '@atlaskit/icon/core/show-more-horizontal';

import { type IconComponent } from '../../types';

export const ShowMoreHorizontalIcon: IconComponent = ({
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
