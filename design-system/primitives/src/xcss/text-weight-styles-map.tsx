// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { getSerializedStylesMap } from './get-serialized-styles-map';
import { type TextWeight, textWeightMap } from './text-weight';

export const textWeightStylesMap: Record<TextWeight, SerializedStyles> = getSerializedStylesMap(
	'fontWeight',
	textWeightMap,
);
