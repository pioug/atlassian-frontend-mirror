// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { getSerializedStylesMap } from './get-serialized-styles-map';
import { type TextColor, textColorMap } from './text-color';

export const textColorStylesMap: Record<TextColor, SerializedStyles> = getSerializedStylesMap(
	'color',
	textColorMap,
);
