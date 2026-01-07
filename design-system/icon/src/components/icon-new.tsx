/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

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

const svgStyles = css({
	color: 'currentColor',
	overflow: 'hidden',
	pointerEvents: 'none',
	verticalAlign: 'bottom',
	/**
	 * Stop-color doesn't properly apply in chrome when the inherited/current color changes.
	 * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
	 * rule) and then override it with currentColor for the color changes to be picked up.
	 */
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
	stop: {
		stopColor: 'currentColor',
	},
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

const smallIconStyles = css({
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

const coreSizeMedium = cssMap({
	none: {
		width: token('space.200'),
		height: token('space.200'),
	},
	compact: {
		width: token('space.300'),
		height: token('space.300'),
	},
	spacious: {
		width: token('space.300'),
		height: token('space.300'),
	},
});

const coreSizeSmall = cssMap({
	none: {
		width: token('space.150'),
		height: token('space.150'),
	},
	compact: {
		width: token('space.200'),
		height: token('space.200'),
	},
	spacious: {
		width: token('space.300'),
		height: token('space.300'),
	},
});

const paddingMap = {
	medium: {
		none: 0,
		compact: 4,
		spacious: 4,
	},
	small: {
		none: 0,
		compact: 2.66,
		spacious: 8,
	},
} as const;

/**
 * __Icon__
 *
 * An icon is used as a visual representation of common actions and commands to provide context.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 */
export const Icon = memo(function Icon(props: UNSAFE_NewGlyphProps) {
	const {
		color = 'currentColor',
		testId,
		label,
		// Used to set icon dimensions/behaviour in codegen
		// Used to set icon glyphs in codegen
		dangerouslySetGlyph,
		// Used with iconTile to scale icon up and down
		shouldScale,
		spacing = 'none',
		name,
	} = props as InternalIconPropsNew;

	const dangerouslySetInnerHTML = dangerouslySetGlyph
		? {
				__html: dangerouslySetGlyph,
			}
		: undefined;

	let size: 'medium' | 'small' = 'medium';
	if ('size' in props && props.size !== undefined) {
		if (typeof props.size === 'string') {
			size = props.size === 'small' || props.size === 'medium' ? props.size : size;
		} else if (name) {
			const newSize = props.size(name);
			size = newSize === 'small' || newSize === 'medium' ? newSize : size;
		}
	}

	const baseSize = 16;
	const viewBoxPadding = paddingMap[size][spacing];
	const viewBoxSize = baseSize + 2 * viewBoxPadding;

	return (
		<span
			data-testid={testId}
			role={label ? 'img' : undefined}
			aria-label={label ? label : undefined}
			aria-hidden={label ? undefined : true}
			style={{ color }}
			css={[
				iconStyles,
				baseHcmStyles,
				shouldScale && scaleStyles,
				size === 'small' && smallIconStyles,
			]}
		>
			<svg
				fill="none"
				// Adjusting the viewBox allows the icon padding to scale with the contents of the SVG, which
				// we want for Icon Tile
				viewBox={`${0 - viewBoxPadding} ${0 - viewBoxPadding} ${viewBoxSize} ${viewBoxSize}`}
				role="presentation"
				css={[
					svgStyles,
					shouldScale
						? scaleSize
						: size === 'small'
							? coreSizeSmall[spacing]
							: coreSizeMedium[spacing],
				]}
				dangerouslySetInnerHTML={dangerouslySetInnerHTML}
			/>
		</span>
	);
});

export default Icon;
