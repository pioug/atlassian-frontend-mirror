/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, memo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import AKIcon from '@atlaskit/icon';
import type { IconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

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
	'--icon-secondary-color': token('elevation.surface', '#FFFFFF'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
	'> svg': {
		maxWidth: '100%',
		maxHeight: '100%',
		color: 'var(--icon-primary-color)',
		fill: 'var(--icon-secondary-color)',
		overflow: 'hidden',
		pointerEvents: 'none',
		verticalAlign: 'bottom',
		/**
		 * Stop-color doesn't properly apply in chrome when the inherited/current color changes.
		 * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
		 * rule) and then override it with currentColor for the color changes to be picked up.
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
		stop: {
			stopColor: 'currentColor',
		},
	},
});

const sizeStyles = cssMap({
	small: {
		width: '16px',
		height: '16px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> svg': {
			width: '16px',
			height: '16px',
		},
	},
	medium: {
		width: '24px',
		height: '24px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> svg': {
			width: '24px',
			height: '24px',
		},
	},
	large: {
		width: '32px',
		height: '32px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> svg': {
			width: '32px',
			height: '32px',
		},
	},
	xlarge: {
		width: '48px',
		height: '48px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> svg': {
			width: '48px',
			height: '48px',
		},
	},
});

/**
 * For windows high contrast mode
 */
const baseHcmStyles = css({
	'@media screen and (forced-colors: active)': {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		filter: 'grayscale(1)',
		'--icon-primary-color': 'CanvasText', // foreground
		'--icon-secondary-color': 'Canvas', // background
	},
});
const primaryEqualsSecondaryHcmStyles = css({
	'@media screen and (forced-colors: active)': {
		// if the primaryColor is the same as the secondaryColor we
		// set the --icon-primary-color to Canvas
		// this is usually to convey state i.e. Checkbox checked -> not checked
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> svg': {
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
 * Duplicated implementation of the Icon component from @atlaskit/icon.
 */
export const Icon = memo(function Icon(props: IconProps) {
	if (fg('platform-custom-icon-migration')) {
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
		const customDimensions =
			width && height ? { width: width + 'px', height: height + 'px' } : null;

		return (
			<span
				data-testid={testId}
				data-vc={`icon-${testId}`}
				role={label ? 'img' : undefined}
				aria-label={label ? label : undefined}
				aria-hidden={label ? undefined : true}
				style={
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						...customDimensions,

						'--icon-primary-color': primaryColor,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						'--icon-secondary-color': secondaryColor,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
					size && sizeStyles[size],
				]}
			/>
		);
	}

	return <AKIcon {...props} />;
});

export default Icon;
