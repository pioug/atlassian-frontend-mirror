/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, type ReactNode } from 'react';

import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import { Text } from '@atlaskit/primitives/compiled';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { formatValue } from './internal/format-value';
import type { BadgeNewProps } from './types';

/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors */
// Nested selectors with data attributes are required for theme switching
const stylesNew = cssMapUnbound({
	root: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		minWidth: token('space.300'),
		justifyContent: 'center',
		flexShrink: 0,
		blockSize: 'min-content',
		borderRadius: token('radius.xsmall', '2px'),
		paddingInline: token('space.050'),
		paddingBlock: 0,
	},
	// Success appearance
	success: {
		color: token('color.text.success.bolder'),
		backgroundColor: token('color.background.success.subtler'),
	},
	// Danger appearance
	danger: {
		color: token('color.text.danger.bolder'),
		backgroundColor: token('color.background.danger.subtler'),
	},
	// Warning appearance
	warning: {
		color: token('color.text.warning.bolder'),
		backgroundColor: token('color.background.warning.subtler'),
	},
	// Information appearance
	information: {
		// Base fallback
		color: token('color.text.information.bolder'),
		backgroundColor: token('color.background.information.subtler'),
	},
	// Discovery appearance
	discovery: {
		color: token('color.text.discovery.bolder'),
		backgroundColor: token('color.background.discovery.subtler'),
	},
	// Neutral appearance
	neutral: {
		color: token('color.text'),
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
	// Inverse appearance - no transformation
	inverse: {
		backgroundColor: token('elevation.surface'),
		color: token('color.text'),
	},
	// Bold Information appearance
	informationBold: {
		color: token('color.text.information.bolder'),
		backgroundColor: token('color.background.information.subtle'),
	},
	// Bold Success appearance
	successBold: {
		color: token('color.text.success.bolder'),
		backgroundColor: token('color.background.success.subtle'),
	},
	// Bold Danger appearance
	dangerBold: {
		color: token('color.text.danger.bolder'),
		backgroundColor: token('color.background.danger.subtle'),
	},
	// Bold Warning appearance
	// Light theme uses color.background.warning.bold (Orange300) for prominence.
	// Dark theme uses color.background.warning.subtle (Orange800) since
	// color.background.warning.bold (Orange1000) is too close to typical dark
	// surface colors and lacks distinguishability. The dark-mode variant is
	// applied via the warningBoldDark style based on useThemeObserver below.
	warningBold: {
		color: token('color.text.warning.bolder'),
		backgroundColor: token('color.background.warning.bold'),
	},
	warningBoldDark: {
		color: token('color.text.warning.bolder'),
		backgroundColor: token('color.background.warning.subtle'),
	},
	// Bold Discovery appearance
	discoveryBold: {
		color: token('color.text.discovery.bolder'),
		backgroundColor: token('color.background.discovery.subtle'),
	},
});
/* eslint-enable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors */

const badgeValueWithNegativeNumberSupported = (
	children?: number | ReactNode,
	max?: number | false,
) => {
	return typeof children === 'number' && max ? formatValue(children, max) : children;
};

/**
 * __BadgeNew__
 *
 * New visual refresh implementation of Badge component for the labelling system.
 * This component is used when the 'platform-dst-lozenge-tag-badge-visual-uplifts' feature flag is enabled.
 *
 * Uses new appearance naming convention:
 * - success (green)
 * - danger (red)
 * - neutral (gray)
 * - information (blue)
 * - inverse (inverted colors)
 * - warning (orange/yellow)
 * - discovery (purple)
 * - informationBold (bold blue, color.background.information.subtle)
 * - successBold (bold green, color.background.success.subtle)
 * - dangerBold (bold red, color.background.danger.subtle)
 * - warningBold (bold warning, color.background.warning.bold)
 * - discoveryBold (bold purple, color.background.discovery.subtle)
 */
const BadgeNew: import('react').NamedExoticComponent<BadgeNewProps> = memo(function BadgeNew({
	appearance = 'neutral',
	children = 0,
	max = 99,
	style,
	testId,
}: BadgeNewProps) {
	const { colorMode } = useThemeObserver();
	// In dark theme, warningBold needs to swap to a lighter background
	// (color.background.warning.subtle / Orange800) for better contrast against
	// the typical dark surface colors.
	const resolvedAppearance =
		appearance === 'warningBold' && colorMode === 'dark' ? 'warningBoldDark' : appearance;

	return (
		<span
			data-testid={testId}
			css={[stylesNew.root, stylesNew[resolvedAppearance]]}
			style={{ background: style?.backgroundColor, color: style?.color }}
		>
			<Text size="small" align="center" color="inherit">
				{badgeValueWithNegativeNumberSupported(children, max)}
			</Text>
		</span>
	);
});

export default BadgeNew;
