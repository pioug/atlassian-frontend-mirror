/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	forwardRef,
	type ReactElement,
	type ReactNode,
} from 'react';

import { jsx, cssMap as unboundedCssMap } from '@compiled/react';

import {
	css,
	cssMap,
	type StrictXCSSProp,
	type XCSSAllProperties,
	type XCSSAllPseudos,
} from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { SurfaceContext } from '../../utils/surface-provider';
import type { BackgroundColorToken, SVGElements } from '../../utils/types';

import type { BasePrimitiveProps, PaddingToken, StyleProp, SurfaceColorToken } from './types';

// Can either Exclude or Extract - here we're excluding all SVG-related elements, <button> elements (handled by Pressable), and <a> elements (handled by Anchor)
type AllowedElements = Exclude<keyof JSX.IntrinsicElements, SVGElements | 'button' | 'a'>;

// Basically just ElementType but without ComponentType, it makes sense to keep the "Type" suffix
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
type CustomElementType<P = any> = {
	[K in AllowedElements]: P extends JSX.IntrinsicElements[K] ? K : never;
}[AllowedElements];

export type BoxProps<T extends CustomElementType> = Omit<
	ComponentPropsWithoutRef<T>,
	'as' | 'className'
> &
	Omit<BasePrimitiveProps, 'xcss' | 'style'> &
	BaseBoxProps<T>;

type BaseBoxProps<T extends CustomElementType> = {
	/**
	 * The DOM element to render as the Box.
	 * - This cannot be any SVG-related element such as `'svg'`, `'animate', `'circle'`, and many more
	 * - This cannot be a `'a'` (use the `Anchor` primitive instead)
	 * - This cannot be a `'button'` (use the `Anchor` primitive instead)
	 * @default 'div'
	 */
	as?: T;
	/**
	 * Elements to be rendered inside the Box.
	 */
	children?: ReactNode;
	/**
	 * Token representing background color with a built-in fallback value.
	 */
	backgroundColor?: SurfaceColorToken | BackgroundColorToken;
	/**
	 * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
	 *
	 * @see paddingBlock
	 * @see paddingInline
	 * @private
	 * @deprecated – Do not use shorthand props, use `props.xcss` instead as these will be deprecated in the future.
	 */
	padding?: PaddingToken;
	/**
	 * Tokens representing CSS shorthand `paddingBlock`.
	 *
	 * @see paddingBlockStart
	 * @see paddingBlockEnd
	 * @private
	 * @deprecated – Do not use shorthand props, use `props.xcss` instead as these will be deprecated in the future.
	 */
	paddingBlock?: PaddingToken;
	/**
	 * Tokens representing CSS `paddingBlockStart`.
	 * @private
	 * @deprecated – Do not use shorthand props, use `props.xcss` instead as these will be deprecated in the future.
	 */
	paddingBlockStart?: PaddingToken;
	/**
	 * Tokens representing CSS `paddingBlockEnd`.
	 * @private
	 * @deprecated – Do not use shorthand props, use `props.xcss` instead as these will be deprecated in the future.
	 */
	paddingBlockEnd?: PaddingToken;
	/**
	 * Tokens representing CSS shorthand `paddingInline`.
	 * @private
	 * @deprecated – Do not use shorthand props, use `props.xcss` instead as these will be deprecated in the future.
	 *
	 * @see paddingInlineStart
	 * @see paddingInlineEnd
	 */
	paddingInline?: PaddingToken;
	/**
	 * Tokens representing CSS `paddingInlineStart`.
	 * @private
	 * @deprecated – Do not use shorthand props, use `props.xcss` instead as these will be deprecated in the future.
	 */
	paddingInlineStart?: PaddingToken;
	/**
	 * Tokens representing CSS `paddingInlineEnd`.
	 * @private
	 * @deprecated – Do not use shorthand props, use `props.xcss` instead as these will be deprecated in the future.
	 */
	paddingInlineEnd?: PaddingToken;
	/**
	 * Forwarded ref.
	 */
	ref?: ComponentPropsWithRef<T>['ref'];
	/**
	 * Inline styles to be applied to the Box. Only apply as a last resort, or where
	 * styles cannot otherwise be calculated outside of the runtime of the component they're applied.
	 */
	style?: Omit<StyleProp['style'], 'background' | 'backgroundColor'>;
	/**
	 * Apply a subset of permitted styles powered by Atlassian Design System design tokens.
	 * It's preferred you do not use `background` in `xcss` or `cssMap()` and instead use `props.backgroundColor` for surface awareness.
	 */
	xcss?: StrictXCSSProp<Exclude<XCSSAllProperties, 'background'>, XCSSAllPseudos>;
};

type BoxComponent = <T extends CustomElementType>(props: BoxProps<T>) => ReactElement | null;

const baseStyles = css({
	boxSizing: 'border-box',
	appearance: 'none',
	border: 'none',
});

const backgroundColorMap = cssMap({
	'color.background.accent.lime.subtlest': {
		backgroundColor: token('color.background.accent.lime.subtlest'),
	},
	'color.background.accent.lime.subtlest.hovered': {
		backgroundColor: token('color.background.accent.lime.subtlest.hovered'),
	},
	'color.background.accent.lime.subtlest.pressed': {
		backgroundColor: token('color.background.accent.lime.subtlest.pressed'),
	},
	'color.background.accent.lime.subtler': {
		backgroundColor: token('color.background.accent.lime.subtler'),
	},
	'color.background.accent.lime.subtler.hovered': {
		backgroundColor: token('color.background.accent.lime.subtler.hovered'),
	},
	'color.background.accent.lime.subtler.pressed': {
		backgroundColor: token('color.background.accent.lime.subtler.pressed'),
	},
	'color.background.accent.lime.subtle': {
		backgroundColor: token('color.background.accent.lime.subtle'),
	},
	'color.background.accent.lime.subtle.hovered': {
		backgroundColor: token('color.background.accent.lime.subtle.hovered'),
	},
	'color.background.accent.lime.subtle.pressed': {
		backgroundColor: token('color.background.accent.lime.subtle.pressed'),
	},
	'color.background.accent.lime.bolder': {
		backgroundColor: token('color.background.accent.lime.bolder'),
	},
	'color.background.accent.lime.bolder.hovered': {
		backgroundColor: token('color.background.accent.lime.bolder.hovered'),
	},
	'color.background.accent.lime.bolder.pressed': {
		backgroundColor: token('color.background.accent.lime.bolder.pressed'),
	},
	'color.background.accent.red.subtlest': {
		backgroundColor: token('color.background.accent.red.subtlest'),
	},
	'color.background.accent.red.subtlest.hovered': {
		backgroundColor: token('color.background.accent.red.subtlest.hovered'),
	},
	'color.background.accent.red.subtlest.pressed': {
		backgroundColor: token('color.background.accent.red.subtlest.pressed'),
	},
	'color.background.accent.red.subtler': {
		backgroundColor: token('color.background.accent.red.subtler'),
	},
	'color.background.accent.red.subtler.hovered': {
		backgroundColor: token('color.background.accent.red.subtler.hovered'),
	},
	'color.background.accent.red.subtler.pressed': {
		backgroundColor: token('color.background.accent.red.subtler.pressed'),
	},
	'color.background.accent.red.subtle': {
		backgroundColor: token('color.background.accent.red.subtle'),
	},
	'color.background.accent.red.subtle.hovered': {
		backgroundColor: token('color.background.accent.red.subtle.hovered'),
	},
	'color.background.accent.red.subtle.pressed': {
		backgroundColor: token('color.background.accent.red.subtle.pressed'),
	},
	'color.background.accent.red.bolder': {
		backgroundColor: token('color.background.accent.red.bolder'),
	},
	'color.background.accent.red.bolder.hovered': {
		backgroundColor: token('color.background.accent.red.bolder.hovered'),
	},
	'color.background.accent.red.bolder.pressed': {
		backgroundColor: token('color.background.accent.red.bolder.pressed'),
	},
	'color.background.accent.orange.subtlest': {
		backgroundColor: token('color.background.accent.orange.subtlest'),
	},
	'color.background.accent.orange.subtlest.hovered': {
		backgroundColor: token('color.background.accent.orange.subtlest.hovered'),
	},
	'color.background.accent.orange.subtlest.pressed': {
		backgroundColor: token('color.background.accent.orange.subtlest.pressed'),
	},
	'color.background.accent.orange.subtler': {
		backgroundColor: token('color.background.accent.orange.subtler'),
	},
	'color.background.accent.orange.subtler.hovered': {
		backgroundColor: token('color.background.accent.orange.subtler.hovered'),
	},
	'color.background.accent.orange.subtler.pressed': {
		backgroundColor: token('color.background.accent.orange.subtler.pressed'),
	},
	'color.background.accent.orange.subtle': {
		backgroundColor: token('color.background.accent.orange.subtle'),
	},
	'color.background.accent.orange.subtle.hovered': {
		backgroundColor: token('color.background.accent.orange.subtle.hovered'),
	},
	'color.background.accent.orange.subtle.pressed': {
		backgroundColor: token('color.background.accent.orange.subtle.pressed'),
	},
	'color.background.accent.orange.bolder': {
		backgroundColor: token('color.background.accent.orange.bolder'),
	},
	'color.background.accent.orange.bolder.hovered': {
		backgroundColor: token('color.background.accent.orange.bolder.hovered'),
	},
	'color.background.accent.orange.bolder.pressed': {
		backgroundColor: token('color.background.accent.orange.bolder.pressed'),
	},
	'color.background.accent.yellow.subtlest': {
		backgroundColor: token('color.background.accent.yellow.subtlest'),
	},
	'color.background.accent.yellow.subtlest.hovered': {
		backgroundColor: token('color.background.accent.yellow.subtlest.hovered'),
	},
	'color.background.accent.yellow.subtlest.pressed': {
		backgroundColor: token('color.background.accent.yellow.subtlest.pressed'),
	},
	'color.background.accent.yellow.subtler': {
		backgroundColor: token('color.background.accent.yellow.subtler'),
	},
	'color.background.accent.yellow.subtler.hovered': {
		backgroundColor: token('color.background.accent.yellow.subtler.hovered'),
	},
	'color.background.accent.yellow.subtler.pressed': {
		backgroundColor: token('color.background.accent.yellow.subtler.pressed'),
	},
	'color.background.accent.yellow.subtle': {
		backgroundColor: token('color.background.accent.yellow.subtle'),
	},
	'color.background.accent.yellow.subtle.hovered': {
		backgroundColor: token('color.background.accent.yellow.subtle.hovered'),
	},
	'color.background.accent.yellow.subtle.pressed': {
		backgroundColor: token('color.background.accent.yellow.subtle.pressed'),
	},
	'color.background.accent.yellow.bolder': {
		backgroundColor: token('color.background.accent.yellow.bolder'),
	},
	'color.background.accent.yellow.bolder.hovered': {
		backgroundColor: token('color.background.accent.yellow.bolder.hovered'),
	},
	'color.background.accent.yellow.bolder.pressed': {
		backgroundColor: token('color.background.accent.yellow.bolder.pressed'),
	},
	'color.background.accent.green.subtlest': {
		backgroundColor: token('color.background.accent.green.subtlest'),
	},
	'color.background.accent.green.subtlest.hovered': {
		backgroundColor: token('color.background.accent.green.subtlest.hovered'),
	},
	'color.background.accent.green.subtlest.pressed': {
		backgroundColor: token('color.background.accent.green.subtlest.pressed'),
	},
	'color.background.accent.green.subtler': {
		backgroundColor: token('color.background.accent.green.subtler'),
	},
	'color.background.accent.green.subtler.hovered': {
		backgroundColor: token('color.background.accent.green.subtler.hovered'),
	},
	'color.background.accent.green.subtler.pressed': {
		backgroundColor: token('color.background.accent.green.subtler.pressed'),
	},
	'color.background.accent.green.subtle': {
		backgroundColor: token('color.background.accent.green.subtle'),
	},
	'color.background.accent.green.subtle.hovered': {
		backgroundColor: token('color.background.accent.green.subtle.hovered'),
	},
	'color.background.accent.green.subtle.pressed': {
		backgroundColor: token('color.background.accent.green.subtle.pressed'),
	},
	'color.background.accent.green.bolder': {
		backgroundColor: token('color.background.accent.green.bolder'),
	},
	'color.background.accent.green.bolder.hovered': {
		backgroundColor: token('color.background.accent.green.bolder.hovered'),
	},
	'color.background.accent.green.bolder.pressed': {
		backgroundColor: token('color.background.accent.green.bolder.pressed'),
	},
	'color.background.accent.teal.subtlest': {
		backgroundColor: token('color.background.accent.teal.subtlest'),
	},
	'color.background.accent.teal.subtlest.hovered': {
		backgroundColor: token('color.background.accent.teal.subtlest.hovered'),
	},
	'color.background.accent.teal.subtlest.pressed': {
		backgroundColor: token('color.background.accent.teal.subtlest.pressed'),
	},
	'color.background.accent.teal.subtler': {
		backgroundColor: token('color.background.accent.teal.subtler'),
	},
	'color.background.accent.teal.subtler.hovered': {
		backgroundColor: token('color.background.accent.teal.subtler.hovered'),
	},
	'color.background.accent.teal.subtler.pressed': {
		backgroundColor: token('color.background.accent.teal.subtler.pressed'),
	},
	'color.background.accent.teal.subtle': {
		backgroundColor: token('color.background.accent.teal.subtle'),
	},
	'color.background.accent.teal.subtle.hovered': {
		backgroundColor: token('color.background.accent.teal.subtle.hovered'),
	},
	'color.background.accent.teal.subtle.pressed': {
		backgroundColor: token('color.background.accent.teal.subtle.pressed'),
	},
	'color.background.accent.teal.bolder': {
		backgroundColor: token('color.background.accent.teal.bolder'),
	},
	'color.background.accent.teal.bolder.hovered': {
		backgroundColor: token('color.background.accent.teal.bolder.hovered'),
	},
	'color.background.accent.teal.bolder.pressed': {
		backgroundColor: token('color.background.accent.teal.bolder.pressed'),
	},
	'color.background.accent.blue.subtlest': {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	'color.background.accent.blue.subtlest.hovered': {
		backgroundColor: token('color.background.accent.blue.subtlest.hovered'),
	},
	'color.background.accent.blue.subtlest.pressed': {
		backgroundColor: token('color.background.accent.blue.subtlest.pressed'),
	},
	'color.background.accent.blue.subtler': {
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
	'color.background.accent.blue.subtler.hovered': {
		backgroundColor: token('color.background.accent.blue.subtler.hovered'),
	},
	'color.background.accent.blue.subtler.pressed': {
		backgroundColor: token('color.background.accent.blue.subtler.pressed'),
	},
	'color.background.accent.blue.subtle': {
		backgroundColor: token('color.background.accent.blue.subtle'),
	},
	'color.background.accent.blue.subtle.hovered': {
		backgroundColor: token('color.background.accent.blue.subtle.hovered'),
	},
	'color.background.accent.blue.subtle.pressed': {
		backgroundColor: token('color.background.accent.blue.subtle.pressed'),
	},
	'color.background.accent.blue.bolder': {
		backgroundColor: token('color.background.accent.blue.bolder'),
	},
	'color.background.accent.blue.bolder.hovered': {
		backgroundColor: token('color.background.accent.blue.bolder.hovered'),
	},
	'color.background.accent.blue.bolder.pressed': {
		backgroundColor: token('color.background.accent.blue.bolder.pressed'),
	},
	'color.background.accent.purple.subtlest': {
		backgroundColor: token('color.background.accent.purple.subtlest'),
	},
	'color.background.accent.purple.subtlest.hovered': {
		backgroundColor: token('color.background.accent.purple.subtlest.hovered'),
	},
	'color.background.accent.purple.subtlest.pressed': {
		backgroundColor: token('color.background.accent.purple.subtlest.pressed'),
	},
	'color.background.accent.purple.subtler': {
		backgroundColor: token('color.background.accent.purple.subtler'),
	},
	'color.background.accent.purple.subtler.hovered': {
		backgroundColor: token('color.background.accent.purple.subtler.hovered'),
	},
	'color.background.accent.purple.subtler.pressed': {
		backgroundColor: token('color.background.accent.purple.subtler.pressed'),
	},
	'color.background.accent.purple.subtle': {
		backgroundColor: token('color.background.accent.purple.subtle'),
	},
	'color.background.accent.purple.subtle.hovered': {
		backgroundColor: token('color.background.accent.purple.subtle.hovered'),
	},
	'color.background.accent.purple.subtle.pressed': {
		backgroundColor: token('color.background.accent.purple.subtle.pressed'),
	},
	'color.background.accent.purple.bolder': {
		backgroundColor: token('color.background.accent.purple.bolder'),
	},
	'color.background.accent.purple.bolder.hovered': {
		backgroundColor: token('color.background.accent.purple.bolder.hovered'),
	},
	'color.background.accent.purple.bolder.pressed': {
		backgroundColor: token('color.background.accent.purple.bolder.pressed'),
	},
	'color.background.accent.magenta.subtlest': {
		backgroundColor: token('color.background.accent.magenta.subtlest'),
	},
	'color.background.accent.magenta.subtlest.hovered': {
		backgroundColor: token('color.background.accent.magenta.subtlest.hovered'),
	},
	'color.background.accent.magenta.subtlest.pressed': {
		backgroundColor: token('color.background.accent.magenta.subtlest.pressed'),
	},
	'color.background.accent.magenta.subtler': {
		backgroundColor: token('color.background.accent.magenta.subtler'),
	},
	'color.background.accent.magenta.subtler.hovered': {
		backgroundColor: token('color.background.accent.magenta.subtler.hovered'),
	},
	'color.background.accent.magenta.subtler.pressed': {
		backgroundColor: token('color.background.accent.magenta.subtler.pressed'),
	},
	'color.background.accent.magenta.subtle': {
		backgroundColor: token('color.background.accent.magenta.subtle'),
	},
	'color.background.accent.magenta.subtle.hovered': {
		backgroundColor: token('color.background.accent.magenta.subtle.hovered'),
	},
	'color.background.accent.magenta.subtle.pressed': {
		backgroundColor: token('color.background.accent.magenta.subtle.pressed'),
	},
	'color.background.accent.magenta.bolder': {
		backgroundColor: token('color.background.accent.magenta.bolder'),
	},
	'color.background.accent.magenta.bolder.hovered': {
		backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
	},
	'color.background.accent.magenta.bolder.pressed': {
		backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
	},
	'color.background.accent.gray.subtlest': {
		backgroundColor: token('color.background.accent.gray.subtlest'),
	},
	'color.background.accent.gray.subtlest.hovered': {
		backgroundColor: token('color.background.accent.gray.subtlest.hovered'),
	},
	'color.background.accent.gray.subtlest.pressed': {
		backgroundColor: token('color.background.accent.gray.subtlest.pressed'),
	},
	'color.background.accent.gray.subtler': {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
	'color.background.accent.gray.subtler.hovered': {
		backgroundColor: token('color.background.accent.gray.subtler.hovered'),
	},
	'color.background.accent.gray.subtler.pressed': {
		backgroundColor: token('color.background.accent.gray.subtler.pressed'),
	},
	'color.background.accent.gray.subtle': {
		backgroundColor: token('color.background.accent.gray.subtle'),
	},
	'color.background.accent.gray.subtle.hovered': {
		backgroundColor: token('color.background.accent.gray.subtle.hovered'),
	},
	'color.background.accent.gray.subtle.pressed': {
		backgroundColor: token('color.background.accent.gray.subtle.pressed'),
	},
	'color.background.accent.gray.bolder': {
		backgroundColor: token('color.background.accent.gray.bolder'),
	},
	'color.background.accent.gray.bolder.hovered': {
		backgroundColor: token('color.background.accent.gray.bolder.hovered'),
	},
	'color.background.accent.gray.bolder.pressed': {
		backgroundColor: token('color.background.accent.gray.bolder.pressed'),
	},
	'color.background.disabled': { backgroundColor: token('color.background.disabled') },
	'color.background.input': { backgroundColor: token('color.background.input') },
	'color.background.input.hovered': { backgroundColor: token('color.background.input.hovered') },
	'color.background.input.pressed': { backgroundColor: token('color.background.input.pressed') },
	'color.background.inverse.subtle': { backgroundColor: token('color.background.inverse.subtle') },
	'color.background.inverse.subtle.hovered': {
		backgroundColor: token('color.background.inverse.subtle.hovered'),
	},
	'color.background.inverse.subtle.pressed': {
		backgroundColor: token('color.background.inverse.subtle.pressed'),
	},
	'color.background.neutral': { backgroundColor: token('color.background.neutral') },
	'color.background.neutral.hovered': {
		backgroundColor: token('color.background.neutral.hovered'),
	},
	'color.background.neutral.pressed': {
		backgroundColor: token('color.background.neutral.pressed'),
	},
	'color.background.neutral.subtle': {
		backgroundColor: token('color.background.neutral.subtle'),
	},
	'color.background.neutral.subtle.hovered': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'color.background.neutral.subtle.pressed': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
	'color.background.neutral.bold': { backgroundColor: token('color.background.neutral.bold') },
	'color.background.neutral.bold.hovered': {
		backgroundColor: token('color.background.neutral.bold.hovered'),
	},
	'color.background.neutral.bold.pressed': {
		backgroundColor: token('color.background.neutral.bold.pressed'),
	},
	'color.background.selected': { backgroundColor: token('color.background.selected') },
	'color.background.selected.hovered': {
		backgroundColor: token('color.background.selected.hovered'),
	},
	'color.background.selected.pressed': {
		backgroundColor: token('color.background.selected.pressed'),
	},
	'color.background.selected.bold': { backgroundColor: token('color.background.selected.bold') },
	'color.background.selected.bold.hovered': {
		backgroundColor: token('color.background.selected.bold.hovered'),
	},
	'color.background.selected.bold.pressed': {
		backgroundColor: token('color.background.selected.bold.pressed'),
	},
	'color.background.brand.subtlest': { backgroundColor: token('color.background.brand.subtlest') },
	'color.background.brand.subtlest.hovered': {
		backgroundColor: token('color.background.brand.subtlest.hovered'),
	},
	'color.background.brand.subtlest.pressed': {
		backgroundColor: token('color.background.brand.subtlest.pressed'),
	},
	'color.background.brand.bold': { backgroundColor: token('color.background.brand.bold') },
	'color.background.brand.bold.hovered': {
		backgroundColor: token('color.background.brand.bold.hovered'),
	},
	'color.background.brand.bold.pressed': {
		backgroundColor: token('color.background.brand.bold.pressed'),
	},
	'color.background.brand.boldest': { backgroundColor: token('color.background.brand.boldest') },
	'color.background.brand.boldest.hovered': {
		backgroundColor: token('color.background.brand.boldest.hovered'),
	},
	'color.background.brand.boldest.pressed': {
		backgroundColor: token('color.background.brand.boldest.pressed'),
	},
	'color.background.danger': { backgroundColor: token('color.background.danger') },
	'color.background.danger.hovered': { backgroundColor: token('color.background.danger.hovered') },
	'color.background.danger.pressed': { backgroundColor: token('color.background.danger.pressed') },
	'color.background.danger.bold': { backgroundColor: token('color.background.danger.bold') },
	'color.background.danger.bold.hovered': {
		backgroundColor: token('color.background.danger.bold.hovered'),
	},
	'color.background.danger.bold.pressed': {
		backgroundColor: token('color.background.danger.bold.pressed'),
	},
	'color.background.warning': { backgroundColor: token('color.background.warning') },
	'color.background.warning.hovered': {
		backgroundColor: token('color.background.warning.hovered'),
	},
	'color.background.warning.pressed': {
		backgroundColor: token('color.background.warning.pressed'),
	},
	'color.background.warning.bold': { backgroundColor: token('color.background.warning.bold') },
	'color.background.warning.bold.hovered': {
		backgroundColor: token('color.background.warning.bold.hovered'),
	},
	'color.background.warning.bold.pressed': {
		backgroundColor: token('color.background.warning.bold.pressed'),
	},
	'color.background.success': { backgroundColor: token('color.background.success') },
	'color.background.success.hovered': {
		backgroundColor: token('color.background.success.hovered'),
	},
	'color.background.success.pressed': {
		backgroundColor: token('color.background.success.pressed'),
	},
	'color.background.success.bold': { backgroundColor: token('color.background.success.bold') },
	'color.background.success.bold.hovered': {
		backgroundColor: token('color.background.success.bold.hovered'),
	},
	'color.background.success.bold.pressed': {
		backgroundColor: token('color.background.success.bold.pressed'),
	},
	'color.background.discovery': { backgroundColor: token('color.background.discovery') },
	'color.background.discovery.hovered': {
		backgroundColor: token('color.background.discovery.hovered'),
	},
	'color.background.discovery.pressed': {
		backgroundColor: token('color.background.discovery.pressed'),
	},
	'color.background.discovery.bold': { backgroundColor: token('color.background.discovery.bold') },
	'color.background.discovery.bold.hovered': {
		backgroundColor: token('color.background.discovery.bold.hovered'),
	},
	'color.background.discovery.bold.pressed': {
		backgroundColor: token('color.background.discovery.bold.pressed'),
	},
	'color.background.information': { backgroundColor: token('color.background.information') },
	'color.background.information.hovered': {
		backgroundColor: token('color.background.information.hovered'),
	},
	'color.background.information.pressed': {
		backgroundColor: token('color.background.information.pressed'),
	},
	'color.background.information.bold': {
		backgroundColor: token('color.background.information.bold'),
	},
	'color.background.information.bold.hovered': {
		backgroundColor: token('color.background.information.bold.hovered'),
	},
	'color.background.information.bold.pressed': {
		backgroundColor: token('color.background.information.bold.pressed'),
	},
	// @ts-expect-error -- Token not valid in `cssMap`, TBD
	'color.blanket': { backgroundColor: token('color.blanket') },
	// @ts-expect-error -- Token not valid in `cssMap`, TBD
	'color.blanket.selected': { backgroundColor: token('color.blanket.selected') },
	// @ts-expect-error -- Token not valid in `cssMap`, TBD
	'color.blanket.danger': { backgroundColor: token('color.blanket.danger') },
	'color.skeleton': { backgroundColor: token('color.skeleton') },
	'color.skeleton.subtle': { backgroundColor: token('color.skeleton.subtle') },
	'elevation.surface': { backgroundColor: token('elevation.surface') },
	'elevation.surface.hovered': { backgroundColor: token('elevation.surface.hovered') },
	'elevation.surface.pressed': { backgroundColor: token('elevation.surface.pressed') },
	'elevation.surface.overlay': { backgroundColor: token('elevation.surface.overlay') },
	'elevation.surface.overlay.hovered': {
		backgroundColor: token('elevation.surface.overlay.hovered'),
	},
	'elevation.surface.overlay.pressed': {
		backgroundColor: token('elevation.surface.overlay.pressed'),
	},
	'elevation.surface.raised': { backgroundColor: token('elevation.surface.raised') },
	'elevation.surface.raised.hovered': {
		backgroundColor: token('elevation.surface.raised.hovered'),
	},
	'elevation.surface.raised.pressed': {
		backgroundColor: token('elevation.surface.raised.pressed'),
	},
	'elevation.surface.sunken': { backgroundColor: token('elevation.surface.sunken') },
	'utility.elevation.surface.current': {
		backgroundColor: token('utility.elevation.surface.current'),
	},
});

const CURRENT_SURFACE_CSS_VAR = `--ds-elevation-surface-current` as const;

const setSurfaceTokenMap = unboundedCssMap({
	'elevation.surface': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface'),
	},
	'elevation.surface.hovered': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.hovered'),
	},
	'elevation.surface.pressed': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.pressed'),
	},
	'elevation.surface.overlay': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay'),
	},
	'elevation.surface.overlay.hovered': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay.hovered'),
	},
	'elevation.surface.overlay.pressed': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay.pressed'),
	},
	'elevation.surface.raised': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.raised'),
	},
	'elevation.surface.raised.hovered': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.raised.hovered'),
	},
	'elevation.surface.raised.pressed': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.raised.pressed'),
	},
	'elevation.surface.sunken': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- TODO: CSS variable names should be safe?
		[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.sunken'),
	},
});

const paddingBlockStartMap = cssMap({
	'space.0': { paddingBlockStart: token('space.0') },
	'space.025': { paddingBlockStart: token('space.025') },
	'space.050': { paddingBlockStart: token('space.050') },
	'space.075': { paddingBlockStart: token('space.075') },
	'space.100': { paddingBlockStart: token('space.100') },
	'space.150': { paddingBlockStart: token('space.150') },
	'space.200': { paddingBlockStart: token('space.200') },
	'space.250': { paddingBlockStart: token('space.250') },
	'space.300': { paddingBlockStart: token('space.300') },
	'space.400': { paddingBlockStart: token('space.400') },
	'space.500': { paddingBlockStart: token('space.500') },
	'space.600': { paddingBlockStart: token('space.600') },
	'space.800': { paddingBlockStart: token('space.800') },
	'space.1000': { paddingBlockStart: token('space.1000') },
});
const paddingBlockEndMap = cssMap({
	'space.0': { paddingBlockEnd: token('space.0') },
	'space.025': { paddingBlockEnd: token('space.025') },
	'space.050': { paddingBlockEnd: token('space.050') },
	'space.075': { paddingBlockEnd: token('space.075') },
	'space.100': { paddingBlockEnd: token('space.100') },
	'space.150': { paddingBlockEnd: token('space.150') },
	'space.200': { paddingBlockEnd: token('space.200') },
	'space.250': { paddingBlockEnd: token('space.250') },
	'space.300': { paddingBlockEnd: token('space.300') },
	'space.400': { paddingBlockEnd: token('space.400') },
	'space.500': { paddingBlockEnd: token('space.500') },
	'space.600': { paddingBlockEnd: token('space.600') },
	'space.800': { paddingBlockEnd: token('space.800') },
	'space.1000': { paddingBlockEnd: token('space.1000') },
});
const paddingInlineStartMap = cssMap({
	'space.0': { paddingInlineStart: token('space.0') },
	'space.025': { paddingInlineStart: token('space.025') },
	'space.050': { paddingInlineStart: token('space.050') },
	'space.075': { paddingInlineStart: token('space.075') },
	'space.100': { paddingInlineStart: token('space.100') },
	'space.150': { paddingInlineStart: token('space.150') },
	'space.200': { paddingInlineStart: token('space.200') },
	'space.250': { paddingInlineStart: token('space.250') },
	'space.300': { paddingInlineStart: token('space.300') },
	'space.400': { paddingInlineStart: token('space.400') },
	'space.500': { paddingInlineStart: token('space.500') },
	'space.600': { paddingInlineStart: token('space.600') },
	'space.800': { paddingInlineStart: token('space.800') },
	'space.1000': { paddingInlineStart: token('space.1000') },
});
const paddingInlineEndMap = cssMap({
	'space.0': { paddingInlineEnd: token('space.0') },
	'space.025': { paddingInlineEnd: token('space.025') },
	'space.050': { paddingInlineEnd: token('space.050') },
	'space.075': { paddingInlineEnd: token('space.075') },
	'space.100': { paddingInlineEnd: token('space.100') },
	'space.150': { paddingInlineEnd: token('space.150') },
	'space.200': { paddingInlineEnd: token('space.200') },
	'space.250': { paddingInlineEnd: token('space.250') },
	'space.300': { paddingInlineEnd: token('space.300') },
	'space.400': { paddingInlineEnd: token('space.400') },
	'space.500': { paddingInlineEnd: token('space.500') },
	'space.600': { paddingInlineEnd: token('space.600') },
	'space.800': { paddingInlineEnd: token('space.800') },
	'space.1000': { paddingInlineEnd: token('space.1000') },
});

/**
 * __Box__
 *
 * A Box is a primitive component that has the design decisions of the Atlassian Design System baked in.
 * Renders a `div` by default.
 *
 * - [Examples](https://atlassian.design/components/primitives/box/examples)
 * - [Code](https://atlassian.design/components/primitives/box/code)
 * - [Usage](https://atlassian.design/components/primitives/box/usage)
 */
const Box = forwardRef(
	<T extends CustomElementType>(
		{
			as: Component = 'div' as T,
			children,
			backgroundColor,
			padding,
			paddingBlock = padding,
			paddingBlockStart = paddingBlock,
			paddingBlockEnd = paddingBlock,
			paddingInline = padding,
			paddingInlineStart = paddingInline,
			paddingInlineEnd = paddingInline,
			style,
			testId,
			xcss,
			...htmlAttributes
		}: BoxProps<T>,
		ref: BoxProps<T>['ref'],
	) => {
		// This is to remove className from safeHtmlAttributes
		// @ts-expect-error -- className doesn't exist in the prop definition but we want to ensure it cannot be applied even if types are bypassed
		const { className: _spreadClass, ...safeHtmlAttributes } = htmlAttributes;

		const node = (
			// @ts-expect-error Expression produces a union type that is too complex to represent. I think this is unavoidable
			<Component
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
				// @ts-ignore -- Expression produces a union type that is too complex to represent. We may be able to narrow the type here but unsure.
				ref={ref}
				className={xcss}
				{...safeHtmlAttributes}
				css={[
					baseStyles,
					backgroundColor && backgroundColorMap[backgroundColor],
					backgroundColor && isSurfaceToken(backgroundColor) && setSurfaceTokenMap[backgroundColor],
					paddingBlockStart && paddingBlockStartMap[paddingBlockStart],
					paddingBlockEnd && paddingBlockEndMap[paddingBlockEnd],
					paddingInlineStart && paddingInlineStartMap[paddingInlineStart],
					paddingInlineEnd && paddingInlineEndMap[paddingInlineEnd],
				]}
				data-testid={testId}
			>
				{children}
			</Component>
		);

		if (backgroundColor) {
			return <SurfaceContext.Provider value={backgroundColor}>{node}</SurfaceContext.Provider>;
		}

		return node;
	},
	// @ts-ignore This typescript error has been surpessed while locally enrolling `@atlaskit/primitives` into Jira
	// The return type of `BoxComponent` does not match the return type of `forwardRef` in React 18
) as BoxComponent;

export default Box;

function isSurfaceToken(
	backgroundColor: string,
): backgroundColor is keyof typeof setSurfaceTokenMap {
	return backgroundColor in setSurfaceTokenMap;
}
