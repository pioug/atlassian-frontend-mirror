/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { type IconTileProps, type IconTileSize, type LegacyIconTileSize } from '../../types';
import { type InternalIconPropsNew } from '../icon-new';

const sizeCrossCompatibleMap: Record<IconTileSize, LegacyIconTileSize | '20'> = {
	// Size mapping from new t-shirt sizes to old pixel sizes
	xsmall: '20',
	small: '24',
	medium: '32',
	large: '40',
	xlarge: '48',
	'16': '16',
	'24': '24',
	'32': '32',
	'40': '40',
	'48': '48',
};

const sizeMap = cssMap({
	'16': {
		width: '16px',
		height: '16px',
	},
	'20': {
		width: '20px',
		height: '20px',
	},
	'24': {
		width: '24px',
		height: '24px',
	},
	'32': {
		width: '32px',
		height: '32px',
	},
	'40': {
		width: '40px',
		height: '40px',
	},
	'48': {
		width: '48px',
		height: '48px',
	},
});

const appearanceMap = cssMap({
	grayBold: {
		backgroundColor: token('color.background.accent.gray.bolder'),
		color: token('color.icon.inverse'),
	},
	limeBold: {
		backgroundColor: token('color.background.accent.lime.bolder'),
		color: token('color.icon.inverse'),
	},
	greenBold: {
		backgroundColor: token('color.background.accent.green.bolder'),
		color: token('color.icon.inverse'),
	},
	blueBold: {
		backgroundColor: token('color.background.accent.blue.bolder'),
		color: token('color.icon.inverse'),
	},
	redBold: {
		backgroundColor: token('color.background.accent.red.bolder'),
		color: token('color.icon.inverse'),
	},
	purpleBold: {
		backgroundColor: token('color.background.accent.purple.bolder'),
		color: token('color.icon.inverse'),
	},
	magentaBold: {
		backgroundColor: token('color.background.accent.magenta.bolder'),
		color: token('color.icon.inverse'),
	},
	tealBold: {
		backgroundColor: token('color.background.accent.teal.bolder'),
		color: token('color.icon.inverse'),
	},
	orangeBold: {
		backgroundColor: token('color.background.accent.orange.bolder'),
		color: token('color.icon.inverse'),
	},
	yellowBold: {
		backgroundColor: token('color.background.accent.yellow.bolder'),
		color: token('color.icon.inverse'),
	},
	gray: {
		backgroundColor: token('color.background.accent.gray.subtler'),
		color: token('color.icon.accent.gray'),
	},
	lime: {
		backgroundColor: token('color.background.accent.lime.subtler'),
		color: token('color.icon.accent.lime'),
	},
	orange: {
		backgroundColor: token('color.background.accent.orange.subtler'),
		color: token('color.icon.accent.orange'),
	},
	magenta: {
		backgroundColor: token('color.background.accent.magenta.subtler'),
		color: token('color.icon.accent.magenta'),
	},
	green: {
		backgroundColor: token('color.background.accent.green.subtler'),
		color: token('color.icon.accent.green'),
	},
	blue: {
		backgroundColor: token('color.background.accent.blue.subtler'),
		color: token('color.icon.accent.blue'),
	},
	red: {
		backgroundColor: token('color.background.accent.red.subtler'),
		color: token('color.icon.accent.red'),
	},
	purple: {
		backgroundColor: token('color.background.accent.purple.subtler'),
		color: token('color.icon.accent.purple'),
	},
	teal: {
		backgroundColor: token('color.background.accent.teal.subtler'),
		color: token('color.icon.accent.teal'),
	},
	yellow: {
		backgroundColor: token('color.background.accent.yellow.subtler'),
		color: token('color.icon.accent.yellow'),
	},
});

const shapeMap = cssMap({
	square: {
		borderRadius: token('radius.small'),
	},
	circle: {
		borderRadius: token('radius.full'),
	},
});

const iconTileStyles = css({
	display: 'inline-flex',
	boxSizing: 'border-box',
	alignItems: 'center',
	justifyContent: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 0 /* Prevents parent font-size from affecting the container */,
});

/**
 * __IconTile__
 *
 * An icon with background shape, color, and size properties determined by Tile.
 */
export default function IconTile(props: IconTileProps) {
	const { icon: Icon, label, appearance, size = '24', shape = 'square', testId } = props;

	const ExpandedIcon = Icon as ComponentType<InternalIconPropsNew>;

	return (
		<span
			data-testid={testId}
			css={[
				iconTileStyles,
				appearanceMap[appearance],
				sizeMap[sizeCrossCompatibleMap[size]],
				shapeMap[shape],
			]}
		>
			<ExpandedIcon color="currentColor" label={label} spacing="spacious" shouldScale={true} />
		</span>
	);
}
