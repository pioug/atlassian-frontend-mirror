/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports

export const textWrapper = (color?: string): SerializedStyles =>
	css({
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		display: 'inline',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color,
	});
