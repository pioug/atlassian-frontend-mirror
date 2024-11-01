/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, memo } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { FocusRingProps } from '../types';

const BORDER_WIDTH = 2;

/**
 * This exists as a workaround so that we can add a wrapping element
 * without affecting the layout of the children
 * and avoids us having to use `cloneElement`, which causes funky behavior
 * with Compiled classnames :)
 */
const wrapperStyles = css({ display: 'contents' });

const controlledStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
	'& > *': {
		outlineColor: token('color.border.focused', '#2684FF'),
		outlineOffset: BORDER_WIDTH,
		outlineStyle: 'solid',
		outlineWidth: BORDER_WIDTH,
	},
});

const controlledInsetStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
	'& > *': {
		outlineOffset: BORDER_WIDTH * -1,
	},
});

/**
 * We are using `:has()` to target the children of the wrapping div
 * https://larsmagnus.co/blog/focus-visible-within-the-missing-pseudo-class#using-has-to-emulate-focus-visible-within
 *
 */
const uncontrolledStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'&:has(:focus-visible) > *': {
		outlineColor: token('color.border.focused', '#2684FF'),
		outlineOffset: BORDER_WIDTH,
		outlineStyle: 'solid',
		outlineWidth: BORDER_WIDTH,
	},
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&:has(:focus-visible) > *': {
			outlineStyle: 'solid',
			outlineWidth: 1,
		},
	},
});

const uncontrolledInsetStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'&:has(:focus-visible) > *': {
		outlineOffset: BORDER_WIDTH * -1,
	},
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&:has(:focus-visible) > *': {
			outlineOffset: BORDER_WIDTH * -1,
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
	const isUncontrolled = typeof focus === 'undefined';
	const isControlledFocus = !isUncontrolled && focus === 'on';

	return (
		<div
			css={[
				wrapperStyles,
				isControlledFocus && controlledStyles,
				isControlledFocus && isInset && controlledInsetStyles,
				isUncontrolled && uncontrolledStyles,
				isUncontrolled && isInset && uncontrolledInsetStyles,
			]}
		>
			{children}
		</div>
	);
});

FocusRing.displayName = 'FocusRing';

export default FocusRing;
