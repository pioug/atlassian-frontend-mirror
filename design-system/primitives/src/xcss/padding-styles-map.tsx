// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { createSpacingStylesMap, type SpacingProperty } from './create-spacing-styles-map';
import { positiveSpaceMap, type Space } from './positive-space';

export const paddingStylesMap: Record<
	SpacingProperty,
	Record<Space, SerializedStyles>
> = createSpacingStylesMap(positiveSpaceMap);
