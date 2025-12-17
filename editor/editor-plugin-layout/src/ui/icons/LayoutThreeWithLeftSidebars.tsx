import React from 'react';

import type { IconProps } from '@atlaskit/icon';
import LayoutThreeColumnsSidebarsLeftIcon from '@atlaskit/icon-lab/core/layout-three-columns-sidebars-left';

export const LayoutThreeWithLeftSidebarsIcon = (props: Omit<IconProps, 'glyph' | 'size'>) => {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <LayoutThreeColumnsSidebarsLeftIcon {...props} />;
};
