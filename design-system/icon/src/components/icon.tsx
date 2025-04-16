/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { IconProps } from '../types';

import { commonSVGStyles, getIconSize } from './styles';
import { getBackground } from './utils';

/**
 * We are hiding these props from consumers as they're used to
 * hack around icon sizing specifically for icon-file-type.
 */
interface InternalIconProps extends IconProps {
	/**
	 * @internal NOT FOR PUBLIC USE.
	 * Fixes the width of the icon.
	 * This is used only for the custom sized icons in `@atlaskit/icon-file-type`.
	 */
	width?: number;

	/**
	 * @internal NOT FOR PUBLIC USE.
	 * Fixes the height of the icon.
	 * This is used only for the custom sized icons in `@atlaskit/icon-file-type`.
	 */
	height?: number;
	/**
	 * @internal NOT FOR PUBLIC USE.
	 * Fixes the margin of the icon.
	 * This is used only for migration away from legacy icons.
	 */
	UNSAFE_margin?: string;
}

const iconStyles = css({
	display: 'inline-block',
	flexShrink: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> svg': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		...commonSVGStyles,
		maxWidth: '100%',
		maxHeight: '100%',
		color: 'var(--icon-primary-color)',
		fill: 'var(--icon-secondary-color)',
		verticalAlign: 'bottom',
	},
});
/**
 * For windows high contrast mode
 */
const baseHcmStyles = css({
	'@media screen and (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> svg': {
			filter: 'grayscale(1)',
			'--icon-primary-color': 'CanvasText', // foreground
			'--icon-secondary-color': 'Canvas', // background
		},
	},
});
const primaryEqualsSecondaryHcmStyles = css({
	'@media screen and (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> svg': {
			// if the primaryColor is the same as the secondaryColor we
			// set the --icon-primary-color to Canvas
			// this is usually to convey state i.e. Checkbox checked -> not checked
			'--icon-primary-color': 'Canvas', // foreground
		},
	},
});
const secondaryTransparentHcmStyles = css({
	'@media screen and (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> svg': {
			'--icon-secondary-color': 'transparent', // background
		},
	},
});

/**
 * __Icon__
 *
 * An icon is used as a visual representation of common actions and commands to provide context.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
export const Icon = memo(function Icon(props: IconProps) {
	const {
		glyph: Glyph,
		dangerouslySetGlyph,
		primaryColor = 'currentColor',
		secondaryColor,
		size,
		testId,
		label,
		width,
		height,
		UNSAFE_margin,
	} = props as InternalIconProps;

	const glyphProps = dangerouslySetGlyph
		? {
				dangerouslySetInnerHTML: {
					__html: dangerouslySetGlyph,
				},
			}
		: { children: Glyph ? <Glyph role="presentation" /> : null };
	const dimensions = getIconSize({ width, height, size });

	return (
		<span
			data-testid={testId}
			data-vc={`icon-${testId}`}
			role={label ? 'img' : undefined}
			aria-label={label ? label : undefined}
			aria-hidden={label ? undefined : true}
			style={
				{
					'--icon-primary-color': primaryColor,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					'--icon-secondary-color': secondaryColor || getBackground(),
					margin: UNSAFE_margin,
				} as CSSProperties
			}
			{...glyphProps}
			css={[
				iconStyles,
				baseHcmStyles,
				primaryColor === secondaryColor && primaryEqualsSecondaryHcmStyles,
				secondaryColor === 'transparent' && secondaryTransparentHcmStyles,
				// NB: This can be resolved if this component, composes base SVG / and/or skeleton
				// We could then simplify how common styles are dealt with simply by encapsulating them
				// at their appropriate level and/or having a singular approach to css variables in the package
				dimensions &&
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css({
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						width: dimensions.width,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						height: dimensions.height,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						'> svg': dimensions,
					}),
			]}
		/>
	);
});

export default Icon;
