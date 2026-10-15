// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type SerializedStyles } from '@emotion/react';

import { getSerializedStylesMap } from './get-serialized-styles-map';

const spacingProperties = [
	'padding',
	'paddingBlock',
	'paddingBlockStart',
	'paddingBlockEnd',
	'paddingInline',
	'paddingInlineStart',
	'paddingInlineEnd',
	'gap',
	'rowGap',
	'columnGap',
] as const;

export type SpacingProperty = (typeof spacingProperties)[number];

export const createSpacingStylesMap = <Token extends string, Property extends SpacingProperty>(
	tokenMap: Record<Token, string>,
	properties: readonly Property[],
): Record<Property, Record<Token, SerializedStyles>> => {
	return properties.reduce(
		(styleMap, spacingProperty) => {
			styleMap[spacingProperty] = getSerializedStylesMap(spacingProperty, tokenMap);

			return styleMap;
		},
		{} as Record<Property, Record<Token, SerializedStyles>>,
	);
};
