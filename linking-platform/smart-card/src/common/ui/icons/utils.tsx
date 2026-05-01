import React, { type ComponentType } from 'react';

import { IconTile, type IconTileProps } from '@atlaskit/icon';
import type { ObjectProps, ObjectTileProps } from '@atlaskit/object/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkSize } from '../../../constants';
import { isIconSizeLarge } from '../../../utils';

import type { AtlaskitIconTileProps } from './types';

export const transformSmartLinkSizeToIconTileSize = (
	size?: SmartLinkSize,
): IconTileProps['size'] => {
	if (fg('platform_sl_icons_refactor')) {
		switch (size) {
			case SmartLinkSize.Small:
			case SmartLinkSize.Medium:
				return '16';
			case SmartLinkSize.XLarge:
			case SmartLinkSize.Large:
				return '24';
			default:
				return '16';
		}
	}

	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return '24';
		default:
			return '16';
	}
};

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

export const renderIconTile = (
	Icon: IconTileProps['icon'],
	appearance: IconTileProps['appearance'],
): React.FC<AtlaskitIconTileProps> => {
	return ({ size, ...props }: AtlaskitIconTileProps) => {
		return (
			<IconTile
				appearance={appearance}
				icon={Icon}
				size={transformSmartLinkSizeToIconTileSize(size)}
				{...props}
			/>
		);
	};
};
