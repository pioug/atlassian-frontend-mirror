// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { CURRENT_SURFACE_CSS_VAR } from '@atlaskit/tokens/constants';

import { getSerializedStylesMap } from './get-serialized-styles-map';
import { type SurfaceColor, surfaceColorMap } from './surface-color';

export const surfaceColorStylesMap: Record<SurfaceColor, SerializedStyles> = getSerializedStylesMap(
	CURRENT_SURFACE_CSS_VAR,
	surfaceColorMap,
);
