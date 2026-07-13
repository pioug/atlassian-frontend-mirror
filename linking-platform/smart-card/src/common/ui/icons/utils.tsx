import React, { type ComponentPropsWithoutRef, type ComponentType } from 'react';

import { IconTile, type IconTileProps } from '@atlaskit/icon';
import type { IconTileSize } from '@atlaskit/icon/types';
import type { ObjectProps, ObjectTileProps } from '@atlaskit/object/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../constants';
import { isIconSizeLarge } from '../../../utils';

import type { AtlaskitIconTileProps } from './types';

type IconTileAppearance = NonNullable<ComponentPropsWithoutRef<typeof IconTile>['appearance']>;

/**
 * Maps IconTile appearance to the icon glyph color token to use when rendering
 * a standalone icon (without a tile background).
 */
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

/**
 * Maps a SmartLinkSize to an IconTileSize, or undefined if the size is too
 * small to render as a tile (e.g. SmartLinkSize.Small / Medium, or no size).
 * When undefined is returned, the caller should render the icon directly
 * without a tile.
 */
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
			// SmartLinkSize.Small, SmartLinkSize.Medium, and undefined all
			// previously mapped to size="16" which has been removed. Render
			// the icon directly (no tile) for these sizes.
			return undefined;
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
	return ({ size, isTiledIcon, ...props }: AtlaskitIconTileProps) => {
		const tileSize = transformSmartLinkSizeToIconTileSize(size);
		if (tileSize === undefined) {
			// size="16" has been removed — render the icon directly without a tile,
			// using the appearance-derived color so it still matches the intended style.
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
		const { ...tileProps } = props;
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
