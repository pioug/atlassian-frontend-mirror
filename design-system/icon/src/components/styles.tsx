import type { Size } from '../types';
import { dimensions } from '../constants';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type CSSObject } from '@emotion/react';

export const commonSVGStyles = {
	overflow: 'hidden',
	pointerEvents: 'none',
	/**
	 * Stop-color doesn't properly apply in chrome when the inherited/current color changes.
	 * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
	 * rule) and then override it with currentColor for the color changes to be picked up.
	 */
	stop: {
		stopColor: 'currentColor',
	},
} as CSSObject;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const smallStyles = css(dimensions.small);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const mediumStyles = css(dimensions.medium);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const largeStyles = css(dimensions.large);
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const xlargeStyles = css(dimensions.xlarge);

// pre-built css style-size map
// eslint-disable-next-line @atlaskit/design-system/no-exported-css, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sizeStyleMap = {
	small: smallStyles,
	medium: mediumStyles,
	large: largeStyles,
	xlarge: xlargeStyles,
};

/**
 * Returns the width of the icon's parent span. This function has
 * special behaviour to deal with icon-file-type specifically.
 *
 * The reality is the SVG still has its own dimensions, so this is
 * a secondary fallback which in 95% of cases is not required.
 * It's only really being kept to maintain backward compatability.
 */
export const getIconSize = ({
	width,
	height,
	size,
}: {
	size?: Size;
	width?: number;
	height?: number;
}) => {
	if (width && height) {
		return { width, height };
	}

	if (size) {
		return dimensions[size];
	}

	return undefined;
};
