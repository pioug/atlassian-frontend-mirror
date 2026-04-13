// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { type Spacing } from '../types';

export function getContentStyle({
	spacing,
}: {
	spacing: Spacing;
}): import('@emotion/react').SerializedStyles {
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		margin: spacing === 'none' ? 0 : '0 2px',

		// content can grow and shrink
		flexGrow: 1,
		flexShrink: 1,

		// ellipsis for overflow text
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	});
}
