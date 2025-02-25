/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ComponentPropsWithRef,
	type ElementType,
	forwardRef,
	type ReactNode,
	type Ref,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { HasTextAncestorProvider, useHasTextAncestor } from '../utils/has-text-ancestor-context';
import { useSurface } from '../utils/surface-provider';
import {
	inverseColorMap,
	type TextColor,
	textColorStylesMap,
	type TextSize,
	textSizeStylesMap,
	type TextWeight,
	textWeightStylesMap,
} from '../xcss/style-maps.partial';

import type { BasePrimitiveProps } from './types';

const asAllowlist = ['span', 'p', 'strong', 'em'] as const;
type AsElement = (typeof asAllowlist)[number];

type TextPropsBase<T extends ElementType = 'span'> = {
	/**
	 * HTML tag to be rendered. Defaults to `span`.
	 */
	as?: AsElement;
	/**
	 * Elements rendered within the Text element.
	 */
	children: ReactNode;
	/**
	 * Token representing text color with a built-in fallback value.
	 * Will apply inverse text color automatically if placed within a Box with bold background color.
	 * Defaults to `color.text` if not nested in other Text components.
	 */
	color?: TextColor | 'inherit';
	/**
	 * The [HTML `id` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
	 */
	id?: string;
	/**
	 * The number of lines to limit the provided text to. Text will be truncated with an ellipsis.
	 *
	 * When `maxLines={1}`, `wordBreak` defaults to `break-all` to match the behaviour of `text-overflow: ellipsis`.
	 */
	maxLines?: number;
	/**
	 * Text alignment.
	 */
	align?: TextAlign;
	/**
	 * Text size.
	 */
	size?: TextSize;
	/**
	 * Font weight.
	 */
	weight?: TextWeight;
	/**
	 * Forwarded ref.
	 */
	ref?: ComponentPropsWithRef<T>['ref'];
};

export type TextProps<T extends ElementType = 'span'> = TextPropsBase<T> &
	Omit<BasePrimitiveProps, 'xcss'>;

// We're doing this because our CSS reset can add top margins to elements such as `p` which is totally insane.
// Long term we should remove those instances from the reset - it should be a reset to 0.
// For now, at least we know <Text> will be unaffected by this.
const resetStyles = css({
	margin: 0,
	overflowWrap: 'anywhere',
});

const strongStyles = css({
	fontWeight: token('font.weight.bold'),
});

const emStyles = css({
	fontStyle: 'italic',
});

type TextAlign = keyof typeof textAlignMap;
const textAlignMap = {
	center: css({ textAlign: 'center' }),
	end: css({ textAlign: 'end' }),
	start: css({ textAlign: 'start' }),
};

const truncationStyles = css({
	display: '-webkit-box',
	overflow: 'hidden',
	WebkitBoxOrient: 'vertical',
});

const wordBreakMap = {
	breakAll: css({ wordBreak: 'break-all' }),
};

/**
 * Custom hook designed to abstract the parsing of the color props and make it clearer in the future how color is reconciled between themes and tokens.
 */
const useColor = (
	colorProp: TextColor | undefined | 'inherit',
	hasTextAncestor: boolean,
): TextColor | undefined => {
	const surface = useSurface();

	if (fg('platform-typography-improved-color-control')) {
		if (colorProp === 'inherit') {
			return undefined;
		}

		if (colorProp) {
			return colorProp;
		}

		if (hasTextAncestor) {
			return undefined;
		}

		if (inverseColorMap.hasOwnProperty(surface)) {
			return inverseColorMap[surface as keyof typeof inverseColorMap];
		}

		return 'color.text';
	}

	/**
	 * Where the color of the surface is inverted we always override the color
	 * as there is no valid choice that is not covered by the override.
	 */
	if (inverseColorMap.hasOwnProperty(surface)) {
		return inverseColorMap[surface as keyof typeof inverseColorMap];
	}

	if (colorProp === 'inherit') {
		return undefined;
	}

	if (!colorProp && hasTextAncestor) {
		return undefined;
	}

	return colorProp || 'color.text';
};

/**
 * __Text__
 *
 * Text is a primitive component that has the Atlassian Design System's design guidelines baked in.
 * This includes considerations for text attributes such as color, font size, font weight, and line height.
 * It renders a `span` by default.
 *
 * @internal
 */
const Text = forwardRef(
	<T extends ElementType = 'span'>(
		{
			as: Component = 'span',
			color: colorProp,
			align,
			testId,
			id,
			size,
			weight,
			maxLines,
			children,
		}: TextProps<T>,
		ref: Ref<any>,
	) => {
		invariant(
			asAllowlist.includes(Component),
			`@atlaskit/primitives: Text received an invalid "as" value of "${Component}"`,
		);

		const hasTextAncestor = useHasTextAncestor();
		const color = useColor(colorProp, hasTextAncestor);

		if (!size && !hasTextAncestor) {
			size = 'medium';
		}

		const component = (
			<Component
				ref={ref}
				css={[
					resetStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					size && textSizeStylesMap[size],
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					color && textColorStylesMap[color],
					maxLines && truncationStyles,
					maxLines === 1 && wordBreakMap.breakAll,
					align && textAlignMap[align],
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					weight && textWeightStylesMap[weight],
					Component === 'em' && emStyles,
					Component === 'strong' && strongStyles,
				]}
				style={{
					WebkitLineClamp: maxLines,
				}}
				data-testid={testId}
				id={id}
			>
				{children}
			</Component>
		);

		return hasTextAncestor ? (
			// no need to re-apply context if the text is already wrapped
			component
		) : (
			<HasTextAncestorProvider value={true}>{component}</HasTextAncestorProvider>
		);
	},
);

export default Text;
