// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { getSerializedStylesMap } from './get-serialized-styles-map';
import { type TextSize, textSizeMap } from './text-size';

export const textSizeStylesMap: Record<TextSize, SerializedStyles> = getSerializedStylesMap(
	'font',
	textSizeMap,
);
