import React from 'react';

import type { IconProps } from '@atlaskit/icon';
import LayoutThreeColumnsSidebarsRightIcon from '@atlaskit/icon-lab/core/layout-three-columns-sidebars-right';

export const LayoutThreeWithRightSidebarsIcon = (props: Omit<IconProps, 'glyph' | 'size'>) => {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <LayoutThreeColumnsSidebarsRightIcon {...props} />;
};
