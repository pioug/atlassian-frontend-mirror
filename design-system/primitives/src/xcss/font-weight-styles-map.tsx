// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { type FontWeight, fontWeightMap } from './font-weight';
import { getSerializedStylesMap } from './get-serialized-styles-map';

export const fontWeightStylesMap: Record<FontWeight, SerializedStyles> = getSerializedStylesMap(
	'fontWeight',
	fontWeightMap,
);
