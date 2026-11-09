// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { createSpacingStylesMap, type SpacingProperty } from './create-spacing-styles-map';
import { type PaddingSpace, paddingSpaceMap } from './padding-space';

export const paddingStylesMap: Record<
	Exclude<SpacingProperty, 'gap' | 'rowGap' | 'columnGap'>,
	Record<PaddingSpace, SerializedStyles>
> = createSpacingStylesMap(paddingSpaceMap, [
	'padding',
	'paddingBlock',
	'paddingBlockStart',
	'paddingBlockEnd',
	'paddingInline',
	'paddingInlineStart',
	'paddingInlineEnd',
]);
