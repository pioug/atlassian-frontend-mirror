/** @jsx jsx */
import { memo } from 'react';

// Compiled isn't ready to be used in components used by Ecosystem
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { type BackgroundColor, Box, Text, type TextColor, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { formatValue } from './internal/utils';
import type { BadgeProps, ThemeAppearance } from './types';

const boxStyles = xcss({
	borderRadius: 'border.radius.200',
	display: 'inline-flex',
	blockSize: 'min-content',
	flexShrink: 0, // Text component can wrap text, this ensures it doesn't wrap in flex containers.
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

const styles = {
	root: css({
		display: 'inline-flex',
		boxSizing: 'border-box',
		minWidth: token('space.300'),
		justifyContent: 'center',
		flexShrink: 0,
		blockSize: 'min-content',
		borderRadius: token('border.radius.050'),
		paddingInline: token('space.050'),
	}),
	added: css({
		backgroundColor: token('color.background.success'),
		color: token('color.text'),
	}),
	default: css({
		backgroundColor: neutral300,
		color: neutral1000,
	}),
	important: css({
		backgroundColor: red300,
		color: neutral1000,
	}),
	primary: css({
		backgroundColor: blue300,
		color: neutral1000,
	}),
	primaryInverted: css({
		backgroundColor: token('elevation.surface'),
		color: token('color.text.brand'),
	}),
	removed: css({
		backgroundColor: token('color.background.danger'),
		color: token('color.text'),
	}),
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
	if (fg('platform-component-visual-refresh')) {
		return (
			<span
				data-testid={testId}
				css={[styles.root, styles[appearance]]}
				style={{ background: style?.backgroundColor, color: style?.color }}
			>
				<Text size="small" align="center" color="inherit">
					{typeof children === 'number' && max ? formatValue(children, max) : children}
				</Text>
			</span>
		);
	}

	return (
		<Box
			testId={testId}
			as="span"
			backgroundColor={backgroundColors[appearance]}
			xcss={boxStyles}
			style={{ background: style?.backgroundColor, color: style?.color }}
			paddingInline="space.075"
		>
			<Text
				size="UNSAFE_small"
				align="center"
				color={style?.color ? 'inherit' : textColors[appearance]}
			>
				{typeof children === 'number' && max ? formatValue(children, max) : children}
			</Text>
		</Box>
	);
});

Badge.displayName = 'Badge';

export default Badge;

const backgroundColors: Record<ThemeAppearance, BackgroundColor> = {
	added: 'color.background.success',
	default: 'color.background.neutral',
	important: 'color.background.danger.bold',
	primary: 'color.background.brand.bold',
	primaryInverted: 'elevation.surface',
	removed: 'color.background.danger',
};

const textColors: Record<ThemeAppearance, TextColor> = {
	added: 'color.text.success',
	default: 'color.text',
	important: 'color.text.inverse',
	primary: 'color.text.inverse',
	primaryInverted: 'color.text.brand',
	removed: 'color.text.danger',
};
