/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, type ReactNode } from 'react';

import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { formatValue } from './internal/utils';
import type { BadgeNewProps, NewAppearance } from './types';

/**
 * Mapping from old appearance names to new appearance names for visual refresh.
 * Used when Badge component passes old prop names to BadgeNew.
 */
export const appearanceMapping: Record<
	| 'added'
	| 'removed'
	| 'default'
	| 'primary'
	| 'primaryInverted'
	| 'important'
	| 'warning'
	| 'discovery'
	| 'danger'
	| 'success'
	| 'information'
	| 'inverse'
	| 'neutral',
	NewAppearance
> = {
	added: 'success',
	removed: 'danger',
	default: 'neutral',
	primary: 'information',
	primaryInverted: 'inverse',
	important: 'danger',
	warning: 'warning',
	discovery: 'discovery',
	danger: 'danger',
	success: 'success',
	information: 'information',
	inverse: 'inverse',
	neutral: 'neutral',
};

/**
 * Mapping from new appearance names to old appearance names for visual refresh.
 * Used when BadgeNew migration is done.
 */
export const appearanceMappingToOld: Record<
	| 'added'
	| 'removed'
	| 'default'
	| 'primary'
	| 'primaryInverted'
	| 'important'
	| 'warning'
	| 'discovery'
	| 'danger'
	| 'success'
	| 'information'
	| 'inverse'
	| 'neutral',
	'added' | 'removed' | 'default' | 'primary' | 'primaryInverted' | 'important'
> = {
	added: 'added',
	removed: 'removed',
	default: 'default',
	primary: 'primary',
	primaryInverted: 'primaryInverted',
	important: 'important',
	danger: 'removed',
	success: 'added',
	information: 'primary',
	inverse: 'primaryInverted',
	neutral: 'default',
	warning: 'default',
	discovery: 'default',
};

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
		backgroundColor: `color-mix(in oklch, ${token('color.background.success.bold')} 20%, ${token('color.background.success.subtler')} 80%)`,

		'@supports (color: oklch(from white l c h))': {
			backgroundColor: `oklch(from ${token('color.background.success.bold')} calc(l * 1.55) c h)`,
		},
		// Dark mode overrides
		'[data-color-mode="dark"] &': {
			'@supports (color: oklch(from white l c h))': {
				backgroundColor: `oklch(from ${token('color.background.success.bold')} calc(l * 0.63) c h)`,
			},
		},
	},
	// Danger appearance
	danger: {
		color: token('color.text.danger.bolder'),
		backgroundColor: `color-mix(in oklch, ${token('color.background.danger.bold')} 50%, ${token('color.background.danger.subtler')} 50%)`,

		'@supports (color: oklch(from white l c h))': {
			backgroundColor: `oklch(from ${token('color.background.danger.bold')} calc(l * 1.4) c h)`,
		},
		// Dark mode overrides
		'[data-color-mode="dark"] &': {
			'@supports (color: oklch(from white l c h))': {
				backgroundColor: `oklch(from ${token('color.background.danger.bold')} calc(l * 0.69) c h)`,
			},
		},
	},
	// Warning appearance
	warning: {
		backgroundColor: token('color.background.warning.bold'),
		color: token('color.text.warning.bolder'),

		'[data-color-mode="dark"] &': {
			backgroundColor: `color-mix(in oklch, ${token('color.background.warning.bold')} 20%, ${token('color.background.warning.subtler')} 80%)`,
			'@supports (color: oklch(from white l c h))': {
				backgroundColor: `oklch(from ${token('color.background.warning.bold')} calc(l * 0.60) c h)`,
			},
		},
	},
	// Information appearance
	information: {
		// Base fallback
		color: token('color.text.information.bolder'),
		backgroundColor: `color-mix(in oklch, ${token('color.background.information.bold')} 50%, ${token('color.background.information.subtler')} 50%)`,

		'@supports (color: oklch(from white l c h))': {
			backgroundColor: `oklch(from ${token('color.background.information.bold')} calc(l * 1.4) c h)`,
		},
		// Dark mode overrides
		'[data-color-mode="dark"] &': {
			'@supports (color: oklch(from white l c h))': {
				backgroundColor: `oklch(from ${token('color.background.information.bold')} calc(l * 0.69) c h)`,
			},
		},
	},
	// Discovery appearance
	discovery: {
		color: token('color.text.discovery.bolder'),
		backgroundColor: `color-mix(in oklch, ${token('color.background.discovery.bold')} 50%, ${token('color.background.discovery.subtler')} 50%)`,

		'@supports (color: oklch(from white l c h))': {
			backgroundColor: `oklch(from ${token('color.background.discovery.bold')} calc(l * 1.4) c h)`,
		},
		// Dark mode overrides
		'[data-color-mode="dark"] &': {
			'@supports (color: oklch(from white l c h))': {
				backgroundColor: `oklch(from ${token('color.background.discovery.bold')} calc(l * 0.69) c h)`,
			},
		},
	},
	// Neutral appearance
	neutral: {
		color: token('color.text'),
		backgroundColor: `color-mix(in oklch, ${token('color.background.neutral.bold')} 33%, ${token('color.background.neutral')} 67%)`,

		'@supports (color: oklch(from white l c h))': {
			backgroundColor: `oklch(from ${token('color.background.neutral.bold')} calc(l * 2.77) c h)`,
		},
		// Dark mode overrides
		'[data-color-mode="dark"] &': {
			'@supports (color: oklch(from white l c h))': {
				backgroundColor: `oklch(from ${token('color.background.neutral.bold')} calc(l * 0.37) c h)`,
			},
		},
	},
	// Inverse appearance - no transformation
	inverse: {
		backgroundColor: token('elevation.surface'),
		color: token('color.text'),
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
 */
const BadgeNew = memo(function BadgeNew({
	appearance = 'neutral',
	children = 0,
	max = 99,
	style,
	testId,
}: BadgeNewProps) {
	return (
		<span
			data-testid={testId}
			css={[stylesNew.root, stylesNew[appearance]]}
			style={{ background: style?.backgroundColor, color: style?.color }}
		>
			<Text size="small" align="center" color="inherit">
				{badgeValueWithNegativeNumberSupported(children, max)}
			</Text>
		</span>
	);
});

export default BadgeNew;
