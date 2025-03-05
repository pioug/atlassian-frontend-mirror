/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, type ReactNode } from 'react';

import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Text, type TextColor } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { formatValue, formatValueWithNegativeSupport } from './internal/utils';
import type { BadgeProps, ThemeAppearance } from './types';

const boxStyles = cssMapUnbound({
	root: {
		display: 'inline-flex',
		flexShrink: 0,
		blockSize: 'min-content',
		borderRadius: token('border.radius.200'),
		paddingInline: token('space.075'),
	},
	added: { backgroundColor: token('color.background.success', '#E3FCEF') },
	default: { backgroundColor: token('color.background.neutral', '#DFE1E6') },
	important: { backgroundColor: token('color.background.danger.bold', '#DE350B') },
	primary: { backgroundColor: token('color.background.brand.bold', '#0052CC') },
	primaryInverted: { backgroundColor: token('elevation.surface') },
	removed: { backgroundColor: token('color.background.danger', '#FFEBE6') },
});

/**
 * Visual refresh colors.
 * Hardcoded hex colors are used as the they should not change based on theme, and there are no appropriate color tokens.
 *
 * Using separate variables as opposed to an object, to comply with UI styling standard
 * https://atlassian.design/components/eslint-plugin-ui-styling-standard/no-unsafe-values/usage#object-access
 */
const neutral300 = '#DDDEE1';
const red300 = '#FD9891';
const blue300 = '#8FB8F6';
const neutral1000 = '#292A2E';

const styles = cssMapUnbound({
	root: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		minWidth: token('space.300'),
		justifyContent: 'center',
		flexShrink: 0,
		blockSize: 'min-content',
		borderRadius: token('border.radius.050'),
		paddingInline: token('space.050'),
	},
	added: {
		backgroundColor: token('color.background.success'),
		color: token('color.text'),
	},
	default: {
		backgroundColor: neutral300,
		color: neutral1000,
	},
	important: {
		backgroundColor: red300,
		color: neutral1000,
	},
	primary: {
		backgroundColor: blue300,
		color: neutral1000,
	},
	primaryInverted: {
		backgroundColor: token('elevation.surface'),
		color: token('color.text.brand'),
	},
	removed: {
		backgroundColor: token('color.background.danger'),
		color: token('color.text'),
	},
});

const badgeValueWithNegativeNumberSupported = (
	children?: number | ReactNode,
	max?: number | false,
) => {
	// Use this flag for allowing negative values(numbers) in badge component when custom number field is used
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration
	if (fg('platform_ken_2029_negative_numbers_badge')) {
		return typeof children === 'number' && typeof max === 'number'
			? formatValueWithNegativeSupport(children, max)
			: children;
	}
	return typeof children === 'number' && max ? formatValue(children, max) : children;
};

/**
 * __Badge__
 *
 * This component gives you the full badge functionality and automatically formats the number you provide in \`children\`.
 *
 * - [Examples](https://atlassian.design/components/badge/examples)
 * - [Code](https://atlassian.design/components/badge/code)
 * - [Usage](https://atlassian.design/components/badge/usage)
 */
const Badge = memo(function Badge({
	appearance = 'default',
	children = 0,
	max = 99,
	style,
	testId,
}: BadgeProps) {
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform-component-visual-refresh')) {
		return (
			<span
				data-testid={testId}
				css={[styles.root, styles[appearance]]}
				style={{ background: style?.backgroundColor, color: style?.color }}
			>
				<Text size="small" align="center" color="inherit">
					{badgeValueWithNegativeNumberSupported(children, max)}
				</Text>
			</span>
		);
	}

	return (
		<span
			data-testid={testId}
			css={[boxStyles.root, boxStyles[appearance]]}
			style={{ backgroundColor: style?.backgroundColor, color: style?.color }}
		>
			<Text
				size="UNSAFE_small"
				align="center"
				color={style?.color ? 'inherit' : textColors[appearance]}
			>
				{badgeValueWithNegativeNumberSupported(children, max)}
			</Text>
		</span>
	);
});

Badge.displayName = 'Badge';

export default Badge;

const textColors: Record<ThemeAppearance, TextColor> = {
	added: 'color.text.success',
	default: 'color.text',
	important: 'color.text.inverse',
	primary: 'color.text.inverse',
	primaryInverted: 'color.text.brand',
	removed: 'color.text.danger',
};
