// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { type Spacing } from '../types';

export function getIconStyle({
	spacing,
}: {
	spacing: Spacing;
}): import('@emotion/react').SerializedStyles {
	return css({
		display: 'flex',
		// icon size cannot grow and shrink
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		margin: spacing === 'none' ? 0 : `0 2px`,
		flexGrow: 0,
		flexShrink: 0,
		alignSelf: 'center',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
		userSelect: 'none',
	});
}
