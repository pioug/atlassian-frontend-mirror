/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { SVGProps } from '../types';

const sizeStyles = cssMap({
	small: {
		width: '16px',
		height: '16px',
	},
	medium: {
		width: '24px',
		height: '24px',
	},
	large: {
		width: '32px',
		height: '32px',
	},
	xlarge: {
		width: '48px',
		height: '48px',
	},
});

const svgStyles = css({
	fill: token('elevation.surface', '#FFFFFF'),
	overflow: 'hidden',
	pointerEvents: 'none',
	/**
	 * Stop-color doesn't properly apply in chrome when the inherited/current color changes.
	 * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
	 * rule) and then override it with currentColor for the color changes to be picked up.
	 */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles
	stop: {
		stopColor: 'currentColor',
	},
});

/**
 * __SVG__
 *
 * @deprecated Custom SVG is deprecated and will be removed from `atlaskit/icon` in an upcoming major release. Please use either an existing icon from @atlaskit/icon or @atlaskit/icon-lab, or contributing to @atlaskit/icon-lab directly. For third party logos, use an SVG element along with a label.
 * 
 * An icon is used as a visual representation of common actions and commands to provide context.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-svgs)
 */
const SVG = memo(function SVG({
	size = 'medium',
	label,
	primaryColor = 'currentColor',
	secondaryColor,
	testId,
	children,
}: SVGProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			style={{
				color: primaryColor,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				fill: secondaryColor,
			}}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={[svgStyles, sizeStyles[size]]}
			data-testid={testId}
			aria-label={label || undefined}
			role={label ? 'img' : 'presentation'}
		>
			{children}
		</svg>
	);
});

export default SVG;
