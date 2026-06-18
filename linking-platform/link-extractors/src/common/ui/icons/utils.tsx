import React, { type ComponentPropsWithoutRef, type ComponentType } from 'react';

import { IconTile, type IconTileProps } from '@atlaskit/icon';
import type { IconTileSize } from '@atlaskit/icon/types';
import type { ObjectProps, ObjectTileProps } from '@atlaskit/object/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../constants';

import type { AtlaskitIconTileProps } from './types';

type IconTileAppearance = NonNullable<ComponentPropsWithoutRef<typeof IconTile>['appearance']>;

const appearanceToStandaloneIconColor: Record<IconTileAppearance, string> = {
	blue: token('color.icon.accent.blue'),
	blueBold: token('color.icon.accent.blue'),
	gray: token('color.icon.accent.gray'),
	grayBold: token('color.icon.accent.gray'),
	green: token('color.icon.accent.green'),
	greenBold: token('color.icon.accent.green'),
	lime: token('color.icon.accent.lime'),
	limeBold: token('color.icon.accent.lime'),
	magenta: token('color.icon.accent.magenta'),
	magentaBold: token('color.icon.accent.magenta'),
	orange: token('color.icon.accent.orange'),
	orangeBold: token('color.icon.accent.orange'),
	purple: token('color.icon.accent.purple'),
	purpleBold: token('color.icon.accent.purple'),
	red: token('color.icon.accent.red'),
	redBold: token('color.icon.accent.red'),
	teal: token('color.icon.accent.teal'),
	tealBold: token('color.icon.accent.teal'),
	yellow: token('color.icon.accent.yellow'),
	yellowBold: token('color.icon.accent.yellow'),
};

const isIconSizeLarge = (size?: SmartLinkSize): boolean | undefined =>
	size && [SmartLinkSize.Large, SmartLinkSize.XLarge].includes(size);

export const transformSmartLinkSizeToIconTileSize = (
	size?: SmartLinkSize,
): IconTileSize | undefined => {
	if (fg('platform_sl_icons_refactor')) {
		switch (size) {
			case SmartLinkSize.Small:
			case SmartLinkSize.Medium:
				return undefined;
			case SmartLinkSize.XLarge:
			case SmartLinkSize.Large:
				return 'small';
			default:
				return undefined;
		}
	}
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return 'small';
		default:
			return undefined;
	}
};

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
	return ({ size, isTiledIcon, ...props }: AtlaskitIconTileProps) => {
		const tileSize = transformSmartLinkSizeToIconTileSize(size);
		if (tileSize === undefined) {
			const label = props.label ?? '';
			return (
				<span
					role={label ? 'img' : undefined}
					aria-label={label || undefined}
					data-testid={props.testId}
				>
					<Icon
						color={appearanceToStandaloneIconColor[appearance as IconTileAppearance] as any}
						label=""
					/>
				</span>
			);
		}
		const { shape: _shape, UNSAFE_circleReplacementComponent: _unsafe, ...tileProps } = props;
		return (
			<IconTile
				appearance={appearance}
				icon={isTiledIcon ? (iconProps) => <Icon {...iconProps} spacing="spacious" /> : Icon}
				size={tileSize}
				{...tileProps}
			/>
		);
	};
};
