// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { type Font, fontMap } from './font';
import { getSerializedStylesMap } from './get-serialized-styles-map';

export const fontStylesMap: Record<Font, SerializedStyles> = getSerializedStylesMap(
	'font',
	fontMap,
);
