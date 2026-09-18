import React from 'react';

import LayoutThreeColumnsSidebarsLeftIcon from '@atlaskit/icon-lab/core/layout-three-columns-sidebars-left';
import type { IconProps } from '@atlaskit/icon/types';

export const LayoutThreeWithLeftSidebarsIcon = (
	props: Omit<IconProps, 'glyph' | 'size'>,
): React.JSX.Element => {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <LayoutThreeColumnsSidebarsLeftIcon {...props} />;
};
