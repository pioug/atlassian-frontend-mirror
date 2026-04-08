import { token } from '@atlaskit/tokens';

import { VAR_SEPARATOR_COLOR } from '../../common/constants';

const scrollIndicatorZIndex = 1;
const scrollIndicatorHeight = 2;
const scrollIndicatorBorderRadius = '1px';
const containerPadding = 8;

interface StyleOpts {
	showTopScrollIndicator?: boolean;
}

export const outerContainerCSS = (
	opts: StyleOpts & { scrollbarWidth: number },
): {
	// Flex is needed to ensure the overflow indicators are positioned correctly.
	readonly display: 'flex';
	readonly height: '100%';
	readonly overflow: 'hidden';
	readonly position: 'relative';
	readonly '&::before': {
		readonly content: "''";
		readonly display: 'block';
		readonly left: 'var(--ds-space-100)';
		readonly right: number;
		readonly height: 2;
		readonly borderRadius: 'var(--ds-radius-xsmall)';
		readonly backgroundColor: 'var(--ds-menu-seperator-color, var(--ds-border))';
		readonly position: 'absolute';
		readonly zIndex: 1;
	};
	readonly '&::after': {
		readonly content: "''";
		readonly position: 'absolute';
		readonly display: 'block';
		readonly borderRadius: 'var(--ds-radius-xsmall)';
		readonly flexShrink: 0;
		readonly height: 2;
		readonly left: 'var(--ds-space-100)';
		readonly right: number;
		readonly bottom: 0;
		readonly zIndex: 1;
		readonly backgroundColor: 'var(--ds-menu-seperator-color, var(--ds-border))';
	};
} =>
	({
		// Flex is needed to ensure the overflow indicators are positioned correctly.
		display: 'flex',
		height: '100%',
		overflow: 'hidden',
		position: 'relative',

		'&::before': {
			content: "''",
			display: 'block',
			left: token('space.100'),
			right: containerPadding + opts.scrollbarWidth,
			height: scrollIndicatorHeight,
			borderRadius: token('radius.xsmall', scrollIndicatorBorderRadius),
			backgroundColor: `var(${VAR_SEPARATOR_COLOR}, ${token('color.border')})`,
			position: 'absolute',
			zIndex: scrollIndicatorZIndex,
		},

		'&::after': {
			content: "''",
			position: 'absolute',
			display: 'block',
			borderRadius: token('radius.xsmall', scrollIndicatorBorderRadius),
			flexShrink: 0,
			height: scrollIndicatorHeight,
			left: token('space.100'),
			right: containerPadding + opts.scrollbarWidth,
			bottom: 0,
			zIndex: scrollIndicatorZIndex,
			backgroundColor: `var(${VAR_SEPARATOR_COLOR}, ${token('color.border')})`,
		},
	}) as const;
