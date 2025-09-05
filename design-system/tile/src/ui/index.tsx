/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { type TileProps } from './types';

const styles = cssMap({
	root: {
		position: 'relative',
		display: 'inline-flex',
		boxSizing: 'border-box',
		alignItems: 'center',
		justifyContent: 'center',
		// TODO: Tokenize after PYX-2175 is merged
		borderRadius: '25%',
		overflow: 'hidden',
		flexShrink: 0,
		flexGrow: 0,
		minWidth: 0,
		minHeight: 0,
	},
	border: {
		borderSize: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	inset: {
		// All elements inside need to be resized, not just img and svg.
		// This is due to them potentially being nested, such as Emojis which are
		// rendered inside spans.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& span, & div, & svg, & img': {
			height: 'auto',
		},
	},
	nonInset: {
		// All elements inside need to be resized, not just img and svg.
		// This is due to them potentially being nested, such as Emojis which are
		// rendered inside spans.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& span, & div, & svg, & img': {
			width: '100%',
			height: '100%',
		},
	},
});

const sizeMap = cssMap({
	xxsmall: { width: '16px', height: '16px', fontSize: '10px' },
	xsmall: { width: '20px', height: '20px', fontSize: '12px' },
	small: { width: '24px', height: '24px', fontSize: '14px' },
	medium: { width: '32px', height: '32px', fontSize: '16px' },
	large: { width: '40px', height: '40px', fontSize: '20px' },
	xlarge: { width: '48px', height: '48px', fontSize: '24px' },
});

const insetSizeMap = cssMap({
	xxsmall: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& span, & div, & svg, & img': {
			width: '10px',
		},
	},
	xsmall: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& span, & div, & svg, & img': {
			width: '12px',
		},
	},
	small: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& span, & div, & svg, & img': {
			width: '14px',
		},
	},
	medium: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& span, & div, & svg, & img': {
			width: '16px',
		},
	},
	large: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& span, & div, & svg, & img': {
			width: '20px',
		},
	},
	xlarge: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& span, & div, & svg, & img': {
			width: '24px',
		},
	},
});

const backgroundColorMap = cssMap({
	white: { backgroundColor: '#FFF' },
	black: { backgroundColor: '#000' },
	'color.background.accent.lime.subtlest': {
		backgroundColor: token('color.background.accent.lime.subtlest'),
	},
	'color.background.accent.lime.subtler': {
		backgroundColor: token('color.background.accent.lime.subtler'),
	},
	'color.background.accent.lime.subtle': {
		backgroundColor: token('color.background.accent.lime.subtle'),
	},
	'color.background.accent.lime.bolder': {
		backgroundColor: token('color.background.accent.lime.bolder'),
	},
	'color.background.accent.red.subtlest': {
		backgroundColor: token('color.background.accent.red.subtlest'),
	},
	'color.background.accent.red.subtler': {
		backgroundColor: token('color.background.accent.red.subtler'),
	},
	'color.background.accent.red.subtle': {
		backgroundColor: token('color.background.accent.red.subtle'),
	},
	'color.background.accent.red.bolder': {
		backgroundColor: token('color.background.accent.red.bolder'),
	},
	'color.background.accent.orange.subtlest': {
		backgroundColor: token('color.background.accent.orange.subtlest'),
	},
	'color.background.accent.orange.subtler': {
		backgroundColor: token('color.background.accent.orange.subtler'),
	},
	'color.background.accent.orange.subtle': {
		backgroundColor: token('color.background.accent.orange.subtle'),
	},
	'color.background.accent.orange.bolder': {
		backgroundColor: token('color.background.accent.orange.bolder'),
	},
	'color.background.accent.yellow.subtlest': {
		backgroundColor: token('color.background.accent.yellow.subtlest'),
	},
	'color.background.accent.yellow.subtler': {
		backgroundColor: token('color.background.accent.yellow.subtler'),
	},
	'color.background.accent.yellow.subtle': {
		backgroundColor: token('color.background.accent.yellow.subtle'),
	},
	'color.background.accent.yellow.bolder': {
		backgroundColor: token('color.background.accent.yellow.bolder'),
	},
	'color.background.accent.green.subtlest': {
		backgroundColor: token('color.background.accent.green.subtlest'),
	},
	'color.background.accent.green.subtler': {
		backgroundColor: token('color.background.accent.green.subtler'),
	},
	'color.background.accent.green.subtle': {
		backgroundColor: token('color.background.accent.green.subtle'),
	},
	'color.background.accent.green.bolder': {
		backgroundColor: token('color.background.accent.green.bolder'),
	},
	'color.background.accent.teal.subtlest': {
		backgroundColor: token('color.background.accent.teal.subtlest'),
	},
	'color.background.accent.teal.subtler': {
		backgroundColor: token('color.background.accent.teal.subtler'),
	},
	'color.background.accent.teal.subtle': {
		backgroundColor: token('color.background.accent.teal.subtle'),
	},
	'color.background.accent.teal.bolder': {
		backgroundColor: token('color.background.accent.teal.bolder'),
	},
	'color.background.accent.blue.subtlest': {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	'color.background.accent.blue.subtler': {
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
	'color.background.accent.blue.subtle': {
		backgroundColor: token('color.background.accent.blue.subtle'),
	},
	'color.background.accent.blue.bolder': {
		backgroundColor: token('color.background.accent.blue.bolder'),
	},
	'color.background.accent.purple.subtlest': {
		backgroundColor: token('color.background.accent.purple.subtlest'),
	},
	'color.background.accent.purple.subtler': {
		backgroundColor: token('color.background.accent.purple.subtler'),
	},
	'color.background.accent.purple.subtle': {
		backgroundColor: token('color.background.accent.purple.subtle'),
	},
	'color.background.accent.purple.bolder': {
		backgroundColor: token('color.background.accent.purple.bolder'),
	},
	'color.background.accent.magenta.subtlest': {
		backgroundColor: token('color.background.accent.magenta.subtlest'),
	},
	'color.background.accent.magenta.subtler': {
		backgroundColor: token('color.background.accent.magenta.subtler'),
	},
	'color.background.accent.magenta.subtle': {
		backgroundColor: token('color.background.accent.magenta.subtle'),
	},
	'color.background.accent.magenta.bolder': {
		backgroundColor: token('color.background.accent.magenta.bolder'),
	},
	'color.background.accent.gray.subtlest': {
		backgroundColor: token('color.background.accent.gray.subtlest'),
	},
	'color.background.accent.gray.subtler': {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
	'color.background.accent.gray.subtle': {
		backgroundColor: token('color.background.accent.gray.subtle'),
	},
	'color.background.accent.gray.bolder': {
		backgroundColor: token('color.background.accent.gray.bolder'),
	},
	'color.background.inverse.subtle': { backgroundColor: token('color.background.inverse.subtle') },
	'color.background.neutral': { backgroundColor: token('color.background.neutral') },
	'color.background.neutral.bold': { backgroundColor: token('color.background.neutral.bold') },
	'color.background.brand.subtlest': { backgroundColor: token('color.background.brand.subtlest') },
	'color.background.brand.bold': { backgroundColor: token('color.background.brand.bold') },
	'color.background.brand.boldest': { backgroundColor: token('color.background.brand.boldest') },
	'color.background.danger': { backgroundColor: token('color.background.danger') },
	'color.background.danger.bold': { backgroundColor: token('color.background.danger.bold') },
	'color.background.warning': { backgroundColor: token('color.background.warning') },
	'color.background.warning.bold': { backgroundColor: token('color.background.warning.bold') },
	'color.background.success': { backgroundColor: token('color.background.success') },
	'color.background.success.bold': { backgroundColor: token('color.background.success.bold') },
	'color.background.discovery': { backgroundColor: token('color.background.discovery') },
	'color.background.discovery.bold': { backgroundColor: token('color.background.discovery.bold') },
	'color.background.information': { backgroundColor: token('color.background.information') },
	'color.background.information.bold': {
		backgroundColor: token('color.background.information.bold'),
	},
});

/**
 * __Tile__
 *
 * A tile is a rounded square that takes an asset (Image, Icon, Logo) and represents a noun.
 *
 */
export default function Tile(props: TileProps) {
	const {
		children,
		label,
		size = 'medium',
		backgroundColor,
		hasBorder,
		isInset = true,
		testId,
	} = props;

	return (
		<span
			data-testid={testId}
			css={[
				styles.root,
				sizeMap[size],
				isInset ? styles.inset : styles.nonInset,
				isInset && insetSizeMap[size],
				backgroundColorMap[backgroundColor || 'color.background.neutral'],
				hasBorder && styles.border,
			]}
		>
			{children}
			<VisuallyHidden>{label}</VisuallyHidden>
		</span>
	);
}
