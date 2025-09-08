import React from 'react';

import type { NewIconProps } from '@atlaskit/icon';

import { type ObjectProps } from './types';

type ObjectBaseProps = ObjectProps & {
	icon: React.ComponentType<NewIconProps>;
	color: NewIconProps['color'];
};

/**
 * __Object base__
 *
 * An object represents an Atlassian-specific content type.
 *
 */
export default function ObjectBase({
	label = '',
	size = 'medium',
	testId,
	color,
	icon: Icon,
}: ObjectBaseProps) {
	return (
		<Icon
			label={label}
			size={size === 'medium' ? 'medium' : 'small'}
			color={color}
			testId={testId}
		/>
	);
}
