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

import { jsx, cssMap as unboundedCssMap } from '@compiled/react';
import invariant from 'tiny-invariant';

import { cssMap, type StrictXCSSProp } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { HasTextAncestorProvider, useHasTextAncestor } from '../../utils/has-text-ancestor-context';
import { useSurface } from '../../utils/surface-provider';

import type { BasePrimitiveProps, FontSize, FontWeight, TextAlign, TextColor } from './types';

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
	size?: FontSize;
	/**
	 * The [HTML `font-weight` attribute](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight).
	 */
	weight?: FontWeight;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'overflowWrap' | 'textDecorationLine', never>;
	/**
	 * Forwarded ref.
	 */
	ref?: ComponentPropsWithRef<T>['ref'];
};

export type TextProps<T extends ElementType = 'span'> = TextPropsBase<T> &
	Omit<BasePrimitiveProps, 'xcss'>;

/**
 * Custom hook designed to abstract the parsing of the color props and make it clearer in the future how color is reconciled between themes and tokens.
 */
const useColor = (
	colorProp: TextColor | undefined | 'inherit',
	hasTextAncestor: boolean,
): TextColor | undefined => {
	const surface = useSurface();

	/*
	 * Where the color of the surface is inverted we always override the color
	 * as there is no valid choice that is not covered by the override.
	 */
	if (surface in inverseColorMap) {
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

const styles = unboundedCssMap({
	root: {
		// We're doing this because our CSS reset can add top margins to elements such as `p` which is totally insane.
		// Long term we should remove those instances from the reset - it should be a reset to 0.
		// For now, at least we know <Text> will be unaffected by this.
		margin: 0,
		overflowWrap: 'anywhere',
	},
	'as.strong': { fontWeight: token('font.weight.bold') },
	'as.em': { fontStyle: 'italic' },
	'textAlign.center': { textAlign: 'center' },
	'textAlign.end': { textAlign: 'end' },
	'textAlign.start': { textAlign: 'start' },
	truncation: {
		display: '-webkit-box',
		overflow: 'hidden',
		// NOTE: This is an obsolete property not used in modern CSS, perhaps unused, but likely added for some compatibility
		WebkitBoxOrient: 'vertical',
	},
	breakAll: { wordBreak: 'break-all' },
});

const fontSizeMap = cssMap({
	medium: { font: token('font.body') },
	UNSAFE_small: { font: token('font.body.UNSAFE_small') },
	large: { font: token('font.body.large') },
	small: { font: token('font.body.small') },
});

const fontWeightMap = unboundedCssMap({
	bold: { fontWeight: token('font.weight.bold') },
	medium: { fontWeight: token('font.weight.medium') },
	regular: { fontWeight: token('font.weight.regular') },
	semibold: { fontWeight: token('font.weight.semibold') },
});

const textColorMap = cssMap({
	'color.text': { color: token('color.text') },
	'color.text.accent.lime': { color: token('color.text.accent.lime') },
	'color.text.accent.lime.bolder': { color: token('color.text.accent.lime.bolder') },
	'color.text.accent.red': { color: token('color.text.accent.red') },
	'color.text.accent.red.bolder': { color: token('color.text.accent.red.bolder') },
	'color.text.accent.orange': { color: token('color.text.accent.orange') },
	'color.text.accent.orange.bolder': { color: token('color.text.accent.orange.bolder') },
	'color.text.accent.yellow': { color: token('color.text.accent.yellow') },
	'color.text.accent.yellow.bolder': { color: token('color.text.accent.yellow.bolder') },
	'color.text.accent.green': { color: token('color.text.accent.green') },
	'color.text.accent.green.bolder': { color: token('color.text.accent.green.bolder') },
	'color.text.accent.teal': { color: token('color.text.accent.teal') },
	'color.text.accent.teal.bolder': { color: token('color.text.accent.teal.bolder') },
	'color.text.accent.blue': { color: token('color.text.accent.blue') },
	'color.text.accent.blue.bolder': { color: token('color.text.accent.blue.bolder') },
	'color.text.accent.purple': { color: token('color.text.accent.purple') },
	'color.text.accent.purple.bolder': { color: token('color.text.accent.purple.bolder') },
	'color.text.accent.magenta': { color: token('color.text.accent.magenta') },
	'color.text.accent.magenta.bolder': { color: token('color.text.accent.magenta.bolder') },
	'color.text.accent.gray': { color: token('color.text.accent.gray') },
	'color.text.accent.gray.bolder': { color: token('color.text.accent.gray.bolder') },
	'color.text.disabled': { color: token('color.text.disabled') },
	'color.text.inverse': { color: token('color.text.inverse') },
	'color.text.selected': { color: token('color.text.selected') },
	'color.text.brand': { color: token('color.text.brand') },
	'color.text.danger': { color: token('color.text.danger') },
	'color.text.warning': { color: token('color.text.warning') },
	'color.text.warning.inverse': { color: token('color.text.warning.inverse') },
	'color.text.success': { color: token('color.text.success') },
	'color.text.discovery': { color: token('color.text.discovery') },
	'color.text.information': { color: token('color.text.information') },
	'color.text.subtlest': { color: token('color.text.subtlest') },
	'color.text.subtle': { color: token('color.text.subtle') },
	'color.link': { color: token('color.link') },
	'color.link.pressed': { color: token('color.link.pressed') },
	'color.link.visited': { color: token('color.link.visited') },
	'color.link.visited.pressed': { color: token('color.link.visited.pressed') },
});

export const inverseColorMap = {
	'color.background.neutral.bold': 'color.text.inverse',
	'color.background.neutral.bold.hovered': 'color.text.inverse',
	'color.background.neutral.bold.pressed': 'color.text.inverse',
	'color.background.selected.bold': 'color.text.inverse',
	'color.background.selected.bold.hovered': 'color.text.inverse',
	'color.background.selected.bold.pressed': 'color.text.inverse',
	'color.background.brand.bold': 'color.text.inverse',
	'color.background.brand.bold.hovered': 'color.text.inverse',
	'color.background.brand.bold.pressed': 'color.text.inverse',
	'color.background.brand.boldest': 'color.text.inverse',
	'color.background.brand.boldest.hovered': 'color.text.inverse',
	'color.background.brand.boldest.pressed': 'color.text.inverse',
	'color.background.danger.bold': 'color.text.inverse',
	'color.background.danger.bold.hovered': 'color.text.inverse',
	'color.background.danger.bold.pressed': 'color.text.inverse',
	'color.background.warning.bold': 'color.text.warning.inverse',
	'color.background.warning.bold.hovered': 'color.text.warning.inverse',
	'color.background.warning.bold.pressed': 'color.text.warning.inverse',
	'color.background.success.bold': 'color.text.inverse',
	'color.background.success.bold.hovered': 'color.text.inverse',
	'color.background.success.bold.pressed': 'color.text.inverse',
	'color.background.discovery.bold': 'color.text.inverse',
	'color.background.discovery.bold.hovered': 'color.text.inverse',
	'color.background.discovery.bold.pressed': 'color.text.inverse',
	'color.background.information.bold': 'color.text.inverse',
	'color.background.information.bold.hovered': 'color.text.inverse',
	'color.background.information.bold.pressed': 'color.text.inverse',
} as const;

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
			xcss,
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
				id={id}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={xcss}
				css={[
					styles.root,
					size && fontSizeMap[size],
					color && textColorMap[color],
					maxLines && styles.truncation,
					maxLines === 1 && styles.breakAll,
					align && styles[`textAlign.${align}`],
					weight && fontWeightMap[weight],
					Component === 'em' && styles['as.em'],
					Component === 'strong' && styles['as.strong'],
				]}
				style={{
					WebkitLineClamp: maxLines,
				}}
				data-testid={testId}
				ref={ref}
			>
				{children}
			</Component>
		);

		if (hasTextAncestor) {
			// no need to re-apply context if the text is already wrapped
			return component;
		}

		return <HasTextAncestorProvider value={true}>{component}</HasTextAncestorProvider>;
	},
);

export default Text;
