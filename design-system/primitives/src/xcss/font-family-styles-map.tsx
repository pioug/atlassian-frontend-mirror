// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { type FontFamily, fontFamilyMap } from './font-family';
import { getSerializedStylesMap } from './get-serialized-styles-map';

export const fontFamilyStylesMap: Record<FontFamily, SerializedStyles> = getSerializedStylesMap(
	'fontFamily',
	fontFamilyMap,
);
