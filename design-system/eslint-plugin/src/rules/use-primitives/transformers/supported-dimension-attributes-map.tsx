import { dimensionsMap } from './dimensions-map';
import type { spaceTokenMap } from './space-token-map';

export const supportedDimensionAttributesMap: {
	[key: string]: typeof spaceTokenMap;
} = {
	width: dimensionsMap,
	height: dimensionsMap,
	minWidth: dimensionsMap,
	minHeight: dimensionsMap,
	maxWidth: dimensionsMap,
	maxHeight: dimensionsMap,
};
