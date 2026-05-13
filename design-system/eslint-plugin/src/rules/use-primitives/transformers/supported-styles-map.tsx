import { spaceTokenMap } from './space-token-map';
import { spaceTokenPositiveMap } from './space-token-positive-map';
import { supportedDimensionAttributesMap } from './supported-dimension-attributes-map';

export const supportedStylesMap: { [key: string]: typeof spaceTokenMap } = {
	padding: spaceTokenPositiveMap,
	paddingBlock: spaceTokenPositiveMap,
	paddingBlockEnd: spaceTokenPositiveMap,
	paddingBlockStart: spaceTokenPositiveMap,
	paddingBottom: spaceTokenPositiveMap,
	paddingInline: spaceTokenPositiveMap,
	paddingInlineEnd: spaceTokenPositiveMap,
	paddingInlineStart: spaceTokenPositiveMap,
	paddingLeft: spaceTokenPositiveMap,
	paddingRight: spaceTokenPositiveMap,
	paddingTop: spaceTokenPositiveMap,
	margin: spaceTokenMap,
	marginBlock: spaceTokenMap,
	marginBlockEnd: spaceTokenMap,
	marginBlockStart: spaceTokenMap,
	marginBottom: spaceTokenMap,
	marginInline: spaceTokenMap,
	marginInlineEnd: spaceTokenMap,
	marginInlineStart: spaceTokenMap,
	marginLeft: spaceTokenMap,
	marginRight: spaceTokenMap,
	marginTop: spaceTokenMap,
	...supportedDimensionAttributesMap,
};
