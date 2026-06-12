import React from 'react';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import type { IconColor, TextColor } from '@atlaskit/tokens/css-type-schema';

import { type ThemeAppearance } from '../lozenge';

import { type IconProp, type LozengeColor } from './types';

export interface IconRendererProps {
	/**
	 * The icon component to render
	 */
	icon: IconProp;
	/**
	 * The lozenge color to determine icon color
	 */
	color: LozengeColor;
	/**
	 * Test ID for the icon
	 */
	testId?: string;
	/**
	 * Size of the icon
	 */
	size?: 'small' | 'medium';
}

// Map lozenge colors to appropriate icon colors.
//
// We intentionally use `color.text.*.bolder` tokens for icons across all
// colored lozenges (semantic + accent). Text tokens use higher-stop palette
// values (Color700+) which pass 3:1 contrast against subtler backgrounds in
// every interactive state — including pressed where icon Color600 fails for
// most hues. Using text tokens uniformly:
//   - avoids global changes to the `color.icon.*` token ramps
//   - keeps icon and text visually aligned in the lozenge
//   - guarantees ≥3:1 contrast across default/hover/pressed states
//
// Neutral lozenges use `color.text.subtle` to match the neutral text styling
// and remain consistent with their alpha-based backgrounds.
const getIconColor = (color: LozengeColor | ThemeAppearance): IconColor | TextColor => {
	switch (color) {
		// Semantic
		case 'success':
			return token('color.text.success');
		case 'warning':
			return token('color.text.warning');
		case 'danger':
			return token('color.text.danger');
		case 'information':
			return token('color.text.information');
		case 'discovery':
			return token('color.text.discovery');
		case 'neutral':
			return token('color.text.subtle');
		// Accent
		case 'accent-red':
			return token('color.text.accent.red');
		case 'accent-orange':
			return token('color.text.accent.orange');
		case 'accent-yellow':
			return token('color.text.accent.yellow');
		case 'accent-lime':
			return token('color.text.accent.lime');
		case 'accent-green':
			return token('color.text.accent.green');
		case 'accent-teal':
			return token('color.text.accent.teal');
		case 'accent-blue':
			return token('color.text.accent.blue');
		case 'accent-purple':
			return token('color.text.accent.purple');
		case 'accent-magenta':
			return token('color.text.accent.magenta');
		case 'accent-gray':
			return token('color.text.subtle');
		default:
			return token('color.text.subtle');
	}
};

const styles = cssMap({
	motion: {
		transitionProperty: 'color',
		transitionDuration: token('motion.duration.medium'),
		transitionTimingFunction: token('motion.easing.inout.bold'),
	},
});

/**
 * Icon renderer for lozenge components
 * Handles proper sizing and color theming for icons
 */
const IconRenderer: (props: IconRendererProps) => React.JSX.Element = ({
	icon: Icon,
	color,
	testId,
	size,
}: IconRendererProps) => {
	const iconColor = getIconColor(color);

	return fg('platform-dst-motion-uplift') ? (
		<Box xcss={styles.motion} style={{ color: iconColor }}>
			<Icon label="" size={size} testId={testId} />
		</Box>
	) : (
		// Cast required because the lozenge intentionally uses some
		// `color.text.*.bolder` tokens for icons that don't pass 3:1 contrast
		// at their default `color.icon.*` stop. The Icon component types only
		// accept `IconColor`, but text tokens are valid CSS color values and
		// render correctly at runtime.
		<Icon color={iconColor as IconColor} label="" size={size} testId={testId} />
	);
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default IconRenderer;
