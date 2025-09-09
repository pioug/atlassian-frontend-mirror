/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, cloneElement, type FC, memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { ClassNames, css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import type { FocusRingProps } from './types';

const BORDER_WIDTH = 2;

const baseFocusOutsideStyles = css({
	outline: `${BORDER_WIDTH}px solid ${token('color.border.focused', '#2684FF')}`,
	outlineOffset: BORDER_WIDTH,
});

const baseInsetStyles = css({
	outlineColor: token('color.border.focused', '#2684FF'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	outlineOffset: -BORDER_WIDTH,
	outlineStyle: 'solid',
	outlineWidth: token('border.width.focused', '2px'),
});

const focusRingStyles = css({
	// Focus styles used when :focus-visible isn't supported
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	'&:focus': baseFocusOutsideStyles,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	'&:focus-visible': baseFocusOutsideStyles,
	// Remove default focus styles for mouse interactions if :focus-visible is supported
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:focus:not(:focus-visible)': {
		outline: 'none',
	},
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		'&:focus-visible': {
			outline: '1px solid',
		},
	},
});

const insetFocusRingStyles = css({
	// Focus styles used when :focus-visible isn't supported
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	'&:focus': baseInsetStyles,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	'&:focus-visible': baseInsetStyles,
	// Remove default focus styles for mouse interactions if :focus-visible is supported
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:focus:not(:focus-visible)': {
		outline: 'none',
	},
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		'&:focus-visible': {
			outline: '1px solid',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			outlineOffset: '-1px',
		},
	},
});

/**
 * __Focus ring__
 *
 * A focus ring visually indicates the currently focused item.
 *
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/focus-ring)
 *
 * @example
 * ```jsx
 * import FocusRing from '@atlaskit/focus-ring';
 *
 * const InteractiveComponent = () => (
 *   <FocusRing>
 *     <button type="button">Hello</button>
 *   </FocusRing>
 * )
 * ```
 */
const FocusRing: FC<FocusRingProps> = memo(({ children, isInset, focus }) => {
	const controlledStyles = isInset ? baseInsetStyles : baseFocusOutsideStyles;
	const uncontrolledStyles = isInset ? insetFocusRingStyles : focusRingStyles;
	const focusCls =
		typeof focus === 'undefined' ? uncontrolledStyles : focus === 'on' && controlledStyles;

	return (
		<ClassNames>
			{({ css, cx }) =>
				Children.only(
					// This may look unwieldy but means we skip applying styles / cloning if no className is applicable
					focusCls
						? // eslint-disable-next-line @repo/internal/react/no-clone-element
							cloneElement(children, {
								className: cx([css(focusCls), children.props.className]),
							})
						: children,
				)
			}
		</ClassNames>
	);
});

FocusRing.displayName = 'FocusRing';

export default FocusRing;
