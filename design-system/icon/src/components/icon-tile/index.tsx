import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type IconTileProps, type NewCoreIconProps } from '../../types';

// Import both versions
import IconTileNew from './icon-tile-new';
import IconTileOld from './icon-tile-old';

// Color mapping for size 16 standalone icons that will no longer be tiles
const appearanceToIconColorMap: Record<IconTileProps['appearance'], NewCoreIconProps['color']> = {
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
 * __IconTile__
 *
 * An icon with background shape, color, and size properties determined by Tile.
 */
export default function IconTile({
	appearance,
	icon: Icon,
	label,
	size,
	testId,
	shape,
	LEGACY_fallbackComponent,
	UNSAFE_circleReplacementComponent,
}: IconTileProps) {
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (LEGACY_fallbackComponent && !fg('platform-visual-refresh-icons')) {
		return LEGACY_fallbackComponent;
	}

	if (
		UNSAFE_circleReplacementComponent &&
		shape === 'circle' &&
		fg('platform_dst_icon_tile_circle_replacement')
	) {
		return UNSAFE_circleReplacementComponent;
	}

	if (shape !== 'circle' && fg('platform_dst_new_icon_tile')) {
		// Handle size 16 - render icon directly without Tile
		if (size === '16') {
			return <Icon color={appearanceToIconColorMap[appearance]} label={label} testId={testId} />;
		}

		return (
			<IconTileNew
				appearance={appearance}
				icon={Icon}
				label={label}
				shape={shape}
				size={size}
				testId={testId}
			/>
		);
	}

	return (
		<IconTileOld
			appearance={appearance}
			icon={Icon}
			label={label}
			shape={shape}
			size={size}
			testId={testId}
		/>
	);
}
