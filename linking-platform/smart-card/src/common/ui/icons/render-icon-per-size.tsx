import React, { type ComponentType } from 'react';

import type { ObjectProps, ObjectTileProps } from '@atlaskit/object/types';

import { type SmartLinkSize } from '../../../constants';
import { isIconSizeLarge } from '../../../utils/is-icon-size-large';

/**
 * For large/xlarge smart-link icon size, renders an `@atlaskit/object/tile/*` component; otherwise a standard `@atlaskit/object` glyph.
 */
export const renderIconPerSize = (
	ObjectIcon: ComponentType<ObjectProps>,
	ObjectTileIcon: ComponentType<ObjectTileProps>,
): React.FC<Omit<ObjectProps, 'size'> & { size?: SmartLinkSize }> => {
	return ({ size, ...props }) => {
		if (isIconSizeLarge(size)) {
			return <ObjectTileIcon {...props} size="small" />;
		}

		return <ObjectIcon {...props} />;
	};
};
