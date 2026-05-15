/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Tile, { type TileProps } from '@atlaskit/tile';
import { token } from '@atlaskit/tokens';

import { type IconTileAppearance, type IconTileProps } from '../../types';
import { type InternalIconPropsNew } from '../icon-new';

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

const iconWrapperStyles = cssMap({
	root: { lineHeight: 0 },
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
export default function IconTileNew(props: IconTileProps): JSX.Element {
	const { icon: Icon, label, appearance, size = 'medium', testId } = props;

	const ExpandedIcon = Icon as ComponentType<InternalIconPropsNew>;

	return (
		<Tile
			size={size}
			backgroundColor={backgroundColorMap[appearance]}
			label={label}
			testId={testId}
		>
			<span css={[iconColorMap[appearance], iconWrapperStyles.root]}>
				<ExpandedIcon color="currentColor" label="" shouldScale={true} />
			</span>
		</Tile>
	);
}
