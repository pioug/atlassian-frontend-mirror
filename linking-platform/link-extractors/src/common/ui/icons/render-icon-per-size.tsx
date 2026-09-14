import React, { type ComponentType } from 'react';

import type { ObjectProps, ObjectTileProps } from '@atlaskit/object/types';

import { SmartLinkSize } from '../../../constants';

const isIconSizeLarge = (size?: SmartLinkSize): boolean | undefined =>
	size && [SmartLinkSize.Large, SmartLinkSize.XLarge].includes(size);

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
