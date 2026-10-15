// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { createSpacingStylesMap, type SpacingProperty } from './create-spacing-styles-map';
import { type GapSpace, gapSpaceMap } from './gap-space';

export const spaceStylesMap: Record<
	Extract<SpacingProperty, 'gap' | 'rowGap' | 'columnGap'>,
	Record<GapSpace, SerializedStyles>
> = createSpacingStylesMap(gapSpaceMap, ['gap', 'rowGap', 'columnGap']);
