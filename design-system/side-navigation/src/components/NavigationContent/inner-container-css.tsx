import { token } from '@atlaskit/tokens';

import { VAR_SCROLL_INDICATOR_COLOR } from '../../common/constants';

const scrollIndicatorMaskZIndex = 2;
const scrollIndicatorHeight = 2;
const scrollIndicatorBorderRadius = '1px';

interface StyleOpts {
	showTopScrollIndicator?: boolean;
}

export const innerContainerCSS = (
	opts: StyleOpts,
): {
	// This after pseudo element abuses being a flex child and pushes itself down to the
	// very bottom of the container - doing so ends up "masking" the actual scroll indicator.
	readonly '&::after': {
		readonly borderRadius: 'var(--ds-radius-xsmall)';
		readonly content: "''";
		readonly display: 'block';
		readonly flexShrink: 0;
		readonly height: 2;
		// This is used to "push" the element to the bottom of the flex container.
		readonly marginTop: 'auto';
		readonly position: 'relative';
		readonly zIndex: 2;
		readonly backgroundColor: 'var(--ds-menu-scroll-indicator-color, var(--ds-surface))';
	};
	readonly '&::before'?:
		| {
				readonly borderRadius: 'var(--ds-radius-xsmall)';
				readonly content: "''";
				readonly left: 0;
				readonly right: 0;
				readonly height: 2;
				readonly backgroundColor: 'var(--ds-menu-scroll-indicator-color, var(--ds-surface))';
				readonly position: 'absolute';
				readonly display: 'block';
				readonly zIndex: 2;
		  }
		| undefined;
	readonly display: 'flex';
	readonly overflow: 'auto';
	readonly width: '100%';
	readonly position: 'relative';
	readonly boxSizing: 'border-box';
	readonly flexDirection: 'column';
} =>
	({
		display: 'flex',
		overflow: 'auto',
		width: '100%',
		position: 'relative',
		boxSizing: 'border-box',
		flexDirection: 'column',

		// This before pseudo element is works by being positioned at the top of this scrolling
		// container - so when you scroll down it stops "masking" the actual scroll indicator.
		...(!opts.showTopScrollIndicator &&
			({
				'&::before': {
					borderRadius: token('radius.xsmall', scrollIndicatorBorderRadius),
					content: "''",
					left: 0,
					right: 0,
					height: scrollIndicatorHeight,
					backgroundColor: `var(${VAR_SCROLL_INDICATOR_COLOR}, ${token('elevation.surface')})`,
					position: 'absolute',
					display: 'block',
					zIndex: scrollIndicatorMaskZIndex,
				},
			} as const)),

		// This after pseudo element abuses being a flex child and pushes itself down to the
		// very bottom of the container - doing so ends up "masking" the actual scroll indicator.
		'&::after': {
			borderRadius: token('radius.xsmall', scrollIndicatorBorderRadius),
			content: "''",
			display: 'block',
			flexShrink: 0,
			height: scrollIndicatorHeight,
			// This is used to "push" the element to the bottom of the flex container.
			marginTop: 'auto',
			position: 'relative',
			zIndex: scrollIndicatorMaskZIndex,
			backgroundColor: `var(${VAR_SCROLL_INDICATOR_COLOR}, ${token('elevation.surface')})`,
		},
	}) as const;
