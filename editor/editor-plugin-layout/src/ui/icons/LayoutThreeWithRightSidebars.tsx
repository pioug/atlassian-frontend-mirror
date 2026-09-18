import React from 'react';

import LayoutThreeColumnsSidebarsRightIcon from '@atlaskit/icon-lab/core/layout-three-columns-sidebars-right';
import type { IconProps } from '@atlaskit/icon/types';

export const LayoutThreeWithRightSidebarsIcon = (
	props: Omit<IconProps, 'glyph' | 'size'>,
): React.JSX.Element => {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <LayoutThreeColumnsSidebarsRightIcon {...props} />;
};
