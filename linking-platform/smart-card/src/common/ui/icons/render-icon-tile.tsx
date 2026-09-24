import React, { type ComponentPropsWithoutRef } from 'react';

import IconTile from '@atlaskit/icon/icon-tile';
import type { IconTileProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { transformSmartLinkSizeToIconTileSize } from './transform-smart-link-size-to-icon-tile-size';
import type { AtlaskitIconTileProps } from './types';

type IconTileAppearance = NonNullable<ComponentPropsWithoutRef<typeof IconTile>['appearance']>;

/**
 * Maps IconTile appearance to the icon glyph color token to use when rendering
 * a standalone icon (without a tile background).
 * When cleaning up `platform_lp_non_bold_large_sl_icon` in NAVX-5752, remove the `*Bold`
 * entries. Nothing will pass a bold appearance into this map after that.
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
 * Bold appearances are the gate-off values. Remove this map when cleaning up
 * `platform_lp_non_bold_large_sl_icon` in NAVX-5752:
 * https://hello.jira.atlassian.cloud/browse/NAVX-5752
 */
const boldToNonBoldAppearance: Partial<Record<IconTileAppearance, IconTileAppearance>> = {
	blueBold: 'blue',
	grayBold: 'gray',
	greenBold: 'green',
	limeBold: 'lime',
	magentaBold: 'magenta',
	orangeBold: 'orange',
	purpleBold: 'purple',
	redBold: 'red',
	tealBold: 'teal',
	yellowBold: 'yellow',
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
		const nonBoldAppearance = boldToNonBoldAppearance[appearance as IconTileAppearance];
		const tileAppearance =
			nonBoldAppearance !== undefined && fg('platform_lp_non_bold_large_sl_icon')
				? nonBoldAppearance
				: appearance;
		return (
			<IconTile
				appearance={tileAppearance}
				icon={isTiledIcon ? (iconProps) => <Icon {...iconProps} spacing="spacious" /> : Icon}
				size={tileSize}
				{...tileProps}
			/>
		);
	};
};
