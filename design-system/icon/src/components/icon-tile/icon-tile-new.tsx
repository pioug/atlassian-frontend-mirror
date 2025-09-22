/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Tile, { type TileProps } from '@atlaskit/tile';
import { token } from '@atlaskit/tokens';

import {
	type IconTileAppearance,
	type IconTileProps,
	type IconTileSize,
	type NewIconTileSize,
} from '../../types';
import { type InternalIconPropsNew } from '../icon-new';

const sizeCrossCompatibleMap: Record<IconTileSize, NewIconTileSize> = {
	// Size mapping from old pixel sizes to new t-shirt sizes
	'16': 'xsmall', // Not used
	'24': 'small',
	'32': 'medium',
	'40': 'large',
	'48': 'xlarge',
	xsmall: 'xsmall',
	small: 'small',
	medium: 'medium',
	large: 'large',
	xlarge: 'xlarge',
};

// Icon color mapping for Tile-based icons
const iconColorMap = cssMap({
	blue: { color: token('color.icon.accent.blue') },
	blueBold: { color: token('color.icon') },
	gray: { color: token('color.icon.subtle') },
	grayBold: { color: token('color.icon.inverse') },
	green: { color: token('color.icon.accent.green') },
	greenBold: { color: token('color.icon') },
	lime: { color: token('color.icon.accent.lime') },
	limeBold: { color: token('color.icon') },
	magenta: { color: token('color.icon.accent.magenta') },
	magentaBold: { color: token('color.icon') },
	orange: { color: token('color.icon.accent.orange') },
	orangeBold: { color: token('color.icon') },
	purple: { color: token('color.icon.accent.purple') },
	purpleBold: { color: token('color.icon') },
	red: { color: token('color.icon.accent.red') },
	redBold: { color: token('color.icon') },
	teal: { color: token('color.icon.accent.teal') },
	tealBold: { color: token('color.icon') },
	yellow: { color: token('color.icon.accent.yellow') },
	yellowBold: { color: token('color.icon') },
});

// Background color mapping for Tile component
const backgroundColorMap: Record<IconTileAppearance, TileProps['backgroundColor']> = {
	blue: undefined,
	blueBold: 'color.background.accent.blue.subtle',
	gray: undefined,
	grayBold: 'color.background.neutral.bold',
	green: undefined,
	greenBold: 'color.background.accent.green.subtle',
	lime: undefined,
	limeBold: 'color.background.accent.lime.subtle',
	magenta: undefined,
	magentaBold: 'color.background.accent.magenta.subtle',
	orange: undefined,
	orangeBold: 'color.background.accent.orange.subtle',
	purple: undefined,
	purpleBold: 'color.background.accent.purple.subtle',
	red: undefined,
	redBold: 'color.background.accent.red.subtle',
	teal: undefined,
	tealBold: 'color.background.accent.teal.subtle',
	yellow: undefined,
	yellowBold: 'color.background.accent.yellow.subtle',
};

/**
 * __IconTile__
 *
 * An icon with background shape, color, and size properties determined by Tile.
 */
export default function IconTileNew(props: IconTileProps) {
	const { icon: Icon, label, appearance, size = 'small', testId } = props;

	const ExpandedIcon = Icon as ComponentType<InternalIconPropsNew>;

	return (
		<Tile
			size={sizeCrossCompatibleMap[size]}
			backgroundColor={backgroundColorMap[appearance]}
			label={label}
			testId={testId}
		>
			<span css={iconColorMap[appearance]}>
				<ExpandedIcon color="currentColor" label={label} shouldScale={true} />
			</span>
		</Tile>
	);
}
