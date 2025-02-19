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

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { BasePrimitiveProps, StyleProp } from '../components/types';

const focusRingStyles = css({
	'&:focus-visible': {
		outlineColor: token('color.border.focused', '#2684FF'),
		outlineOffset: token('border.width.outline'),
		outlineStyle: 'solid',
		outlineWidth: token('border.width.outline'),
	},
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		'&:focus-visible': {
			outlineStyle: 'solid',
			outlineWidth: 1,
		},
	},
});

const insetFocusRingStyles = css({
	'&:focus-visible': {
		outlineOffset: `calc(0px - ${token('border.width.outline')})`,
	},
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		'&:focus-visible': {
			outlineOffset: `calc(0px - ${token('border.width.outline')})`,
		},
	},
});

type AllowedElements = Exclude<keyof JSX.IntrinsicElements, 'button' | 'a'>;

type CustomElement<P = any> = {
	[K in AllowedElements]: P extends JSX.IntrinsicElements[K] ? K : never;
}[AllowedElements];

export type FocusableProps<T extends CustomElement> = Omit<
	ComponentPropsWithoutRef<T>,
	keyof BaseFocusableProps<T> | 'className' | 'style'
> &
	BasePrimitiveProps &
	StyleProp &
	BaseFocusableProps<T>;

type BaseFocusableProps<T extends CustomElement> = {
	/**
	 * The DOM element to render as the Focusable element.
	 * @default 'button'
	 */
	as?: T;
	children?: ReactNode;
	/**
	 * Controls whether the focus ring should be applied around or within the composed element.
	 */
	isInset?: boolean;
	/**
	 * Forwarded ref.
	 */
	ref?: ComponentPropsWithRef<T>['ref'];
};

type FocusableComponent = <T extends CustomElement>(props: FocusableProps<T>) => ReactElement;

/**
 * __Focus ring__
 *
 * A focus ring visually indicates the currently focused item.
 *
 */
const Focusable = forwardRef(
	<T extends CustomElement>(
		{
			as: Component = 'button' as T,
			children,
			isInset,
			testId,
			style,
			xcss,
			...htmlAttributes
		}: FocusableProps<T>,
		ref: FocusableProps<T>['ref'],
	) => {
		// This is to remove className from safeHtmlAttributes
		// @ts-expect-error className doesn't exist in the prop definition but we want to ensure it cannot be applied even if types are bypassed
		const { className: _spreadClass, ...safeHtmlAttributes } = htmlAttributes;

		return (
			// @ts-expect-error Expression produces a union type that is too complex to represent. I think this is unavoidable
			<Component
				{...safeHtmlAttributes}
				// @ts-ignore Expression produces a union type that is too complex to represent. We may be able to narrow the type here but unsure.
				ref={ref}
				className={xcss}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={style}
				css={[focusRingStyles, isInset && insetFocusRingStyles]}
				data-testid={testId}
			>
				{children}
			</Component>
		);
	},
) as FocusableComponent;

export default Focusable;
