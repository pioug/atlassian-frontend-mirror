import React, { type ComponentPropsWithoutRef, type ComponentType } from 'react';

import { IconTile } from '@atlaskit/icon';

import { SmartLinkSize } from '../../../constants';
import { isIconSizeLarge } from '../../../utils';

import type { AtlaskitIconTileProps } from './types';

export const transformSmartLinkSizeToIconTileSize = (size?: SmartLinkSize) => {
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return '24';
		default:
			return '16';
	}
};

type IconProps = {
	label: string;
	testId?: string;
};

export const renderIconPerSize = (
	IconSmall: ComponentType<IconProps>,
	IconLarge: ComponentType<IconProps>,
): React.FC<IconProps & { size?: SmartLinkSize }> => {
	return ({ size, ...props }) => {
		if (isIconSizeLarge(size)) {
			return <IconLarge {...props} />;
		}

		return <IconSmall {...props} />;
	};
};

type IconTileProps = ComponentPropsWithoutRef<typeof IconTile>;
export const renderIconTile = (
	Icon: IconTileProps['icon'],
	appearance: IconTileProps['appearance'],
	LegacyIcon?: ComponentType<AtlaskitIconTileProps>,
): React.FC<AtlaskitIconTileProps> => {
	return ({ size, ...props }: AtlaskitIconTileProps) => {
		return (
			<IconTile
				appearance={appearance}
				icon={Icon}
				size={transformSmartLinkSizeToIconTileSize(size)}
				{...props}
				LEGACY_fallbackComponent={LegacyIcon && <LegacyIcon {...props} size={size} />}
			/>
		);
	};
};
