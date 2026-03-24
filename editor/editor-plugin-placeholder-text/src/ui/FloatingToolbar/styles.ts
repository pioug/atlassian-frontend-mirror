// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const container = (height?: number): SerializedStyles =>
	css({
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box',
		padding: `${token('space.050')} ${token('space.100')}`,
		backgroundColor: token('color.background.input'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: height ? `${height}px` : undefined,
	});
