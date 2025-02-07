/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { UNSAFE_NewGlyphProps } from '../types';

/**
 * We are hiding this props from consumers as it's reserved
 * for use by Icon Tile.
 */
export type InternalIconPropsNew = UNSAFE_NewGlyphProps & {
	/**
	 * @internal NOT FOR PUBLIC USE.
	 * Sets whether the icon should inherit size from a parent. Used by Icon Tile.
	 */
	shouldScale?: boolean;
};

const commonSVGStyles = css({
	overflow: 'hidden',
	pointerEvents: 'none',
	/**
	 * Stop-color doesn't properly apply in chrome when the inherited/current color changes.
	 * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
	 * rule) and then override it with currentColor for the color changes to be picked up.
	 */
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	stop: {
		stopColor: 'currentColor',
	},
});

const svgStyles = css({
	color: 'currentColor',
	verticalAlign: 'bottom',
});

const iconStyles = css({
	display: 'inline-block',
	boxSizing: 'border-box',
	flexShrink: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	paddingInlineEnd: 'var(--ds--button--new-icon-padding-end, 0)',
	paddingInlineStart: 'var(--ds--button--new-icon-padding-start, 0)',
});

const utilityIconStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: token('space.150'),
});

const scaleStyles = css({
	width: 'inherit',
	height: 'inherit',
});

/**
 * For windows high contrast mode
 */
const baseHcmStyles = css({
	'@media screen and (forced-colors: active)': {
		color: 'CanvasText',
		filter: 'grayscale(1)',
	},
});

const scaleSize = css({
	width: 'inherit',
	height: 'inherit',
});

const sizeMap = {
	core: {
		none: css({
			width: token('space.200'),
			height: token('space.200'),
		}),
		spacious: css({
			width: token('space.300'),
			height: token('space.300'),
		}),
	},
	utility: {
		none: css({
			width: token('space.150'),
			height: token('space.150'),
		}),
		compact: css({
			width: token('space.200'),
			height: token('space.200'),
		}),
		spacious: css({
			width: token('space.300'),
			height: token('space.300'),
		}),
	},
} as const;

const baseSizeMap = {
	core: 16,
	utility: 12,
};

const paddingMap = {
	core: {
		none: 0,
		spacious: 4,
	},
	utility: {
		none: 0,
		compact: 2,
		spacious: 6,
	},
} as const;

/**
 * __Icon__
 *
 * An icon is used as a visual representation of common actions and commands to provide context.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
export const Icon = memo(function Icon(props: UNSAFE_NewGlyphProps) {
	const {
		color = 'currentColor',
		testId,
		label,
		LEGACY_primaryColor,
		LEGACY_secondaryColor,
		LEGACY_size,
		LEGACY_fallbackIcon: FallbackIcon,
		// Used to set icon dimensions/behaviour in codegen
		// Used to set icon glyphs in codegen
		dangerouslySetGlyph,
		// Used with iconTile to scale icon up and down
		shouldScale,
		LEGACY_margin,
	} = props as InternalIconPropsNew;

	const dangerouslySetInnerHTML = dangerouslySetGlyph
		? {
				__html: dangerouslySetGlyph,
			}
		: undefined;

	// Fall back to old icon
	if (FallbackIcon && !fg('platform-visual-refresh-icons')) {
		// parse out unnecessary props
		return (
			<FallbackIcon
				primaryColor={LEGACY_primaryColor ?? color}
				secondaryColor={LEGACY_secondaryColor}
				size={LEGACY_size}
				label={label}
				testId={testId}
				// @ts-ignore-next-line
				UNSAFE_margin={LEGACY_margin}
			/>
		);
	}

	const baseSize = baseSizeMap[props.type ?? 'core'];

	let viewBoxPadding: number;
	if (props.type === 'utility') {
		viewBoxPadding = paddingMap[props.type][props.spacing ?? 'none'];
	} else {
		viewBoxPadding = paddingMap['core'][props.spacing ?? 'none'];
	}

	const viewBoxSize = baseSize + 2 * viewBoxPadding;

	// Workaround for the transparency in our disabled icon token.
	// Because we have multiple strokes in icons, opacities overlap
	// This filter has an impact on render performance, but this is
	// acceptable as icons aren't commonly disabled en-masse
	let iconColor = color;
	if (dangerouslySetInnerHTML && color === token('color.icon.disabled')) {
		dangerouslySetInnerHTML.__html = `
<filter id="ds-newIconOpacityFilter">
  <feFlood flood-color="var(--ds-icon-disabled)" />
  <feComposite in2="SourceGraphic" operator="in" />
</filter>
<g filter="url(#ds-newIconOpacityFilter)">
  ${dangerouslySetInnerHTML.__html}
</g>`;
		iconColor = token('color.icon');
	}

	return (
		<span
			data-testid={testId}
			role={label ? 'img' : undefined}
			aria-label={label ? label : undefined}
			aria-hidden={label ? undefined : true}
			style={{ color: iconColor }}
			css={[
				iconStyles,
				baseHcmStyles,
				shouldScale && scaleStyles,
				props.type === 'utility' && utilityIconStyles,
			]}
		>
			<svg
				fill="none"
				// Adjusting the viewBox allows the icon padding to scale with the contents of the SVG, which
				// we want for Icon Tile
				viewBox={`${0 - viewBoxPadding} ${0 - viewBoxPadding} ${viewBoxSize} ${viewBoxSize}`}
				role="presentation"
				css={[
					commonSVGStyles,
					svgStyles,
					shouldScale
						? scaleSize
						: props.type === 'utility'
							? sizeMap[props.type][props.spacing ?? 'none']
							: sizeMap['core'][props.spacing ?? 'none'],
				]}
				dangerouslySetInnerHTML={dangerouslySetInnerHTML}
			/>
		</span>
	);
});

export default Icon;
