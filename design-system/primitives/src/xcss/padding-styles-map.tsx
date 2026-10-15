// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { createSpacingStylesMap, type SpacingProperty } from './create-spacing-styles-map';
import { positiveSpaceMap, type Space } from './positive-space';

export const paddingStylesMap: Record<
	Exclude<SpacingProperty, 'gap' | 'rowGap' | 'columnGap'>,
	Record<Space, SerializedStyles>
> = createSpacingStylesMap(positiveSpaceMap, [
	'padding',
	'paddingBlock',
	'paddingBlockStart',
	'paddingBlockEnd',
	'paddingInline',
	'paddingInlineStart',
	'paddingInlineEnd',
]);
