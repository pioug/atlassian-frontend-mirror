import { allSpaceMap } from './all-space';
import { backgroundColorMap } from './background-color';
import { borderColorMap } from './border-color';
import { borderRadiusMap } from './border-radius';
import { borderWidthMap } from './border-width';
import { dimensionMap } from './dimension';
import { fontMap } from './font';
import { fontFamilyMap } from './font-family';
import { fontWeightMap } from './font-weight';
import { layerMap } from './layer';
import { opacityMap } from './opacity';
import { positiveSpaceMap } from './positive-space';
import { shadowMap } from './shadow';
import { textColorMap } from './text-color';
import type { TokenisedProps } from './tokenised-props';

type StrictTokensMap = {
	[p in keyof TokenisedProps]:
		| typeof backgroundColorMap
		| typeof dimensionMap
		| typeof borderColorMap
		| typeof borderRadiusMap
		| typeof borderWidthMap
		| typeof layerMap
		| typeof opacityMap
		| typeof positiveSpaceMap
		| typeof allSpaceMap
		| typeof shadowMap
		| typeof textColorMap
		| typeof fontFamilyMap
		| typeof fontMap
		| typeof fontWeightMap;
};

export const tokensMap: {
	readonly backgroundColor: typeof backgroundColorMap;
	readonly blockSize: typeof dimensionMap;
	readonly borderBlockColor: typeof borderColorMap;
	readonly borderBlockEndColor: typeof borderColorMap;
	readonly borderBlockEndWidth: typeof borderWidthMap;
	readonly borderBlockStartColor: typeof borderColorMap;
	readonly borderBlockStartWidth: typeof borderWidthMap;
	readonly borderBlockWidth: typeof borderWidthMap;
	readonly borderBottomColor: typeof borderColorMap;
	readonly borderBottomLeftRadius: typeof borderRadiusMap;
	readonly borderBottomRightRadius: typeof borderRadiusMap;
	readonly borderBottomWidth: typeof borderWidthMap;
	readonly borderColor: typeof borderColorMap;
	readonly borderEndEndRadius: typeof borderRadiusMap;
	readonly borderEndStartRadius: typeof borderRadiusMap;
	readonly borderInlineColor: typeof borderColorMap;
	readonly borderInlineEndColor: typeof borderColorMap;
	readonly borderInlineEndWidth: typeof borderWidthMap;
	readonly borderInlineStartColor: typeof borderColorMap;
	readonly borderInlineStartWidth: typeof borderWidthMap;
	readonly borderInlineWidth: typeof borderWidthMap;
	readonly borderLeftColor: typeof borderColorMap;
	readonly borderLeftWidth: typeof borderWidthMap;
	readonly borderRadius: typeof borderRadiusMap;
	readonly borderRightColor: typeof borderColorMap;
	readonly borderRightWidth: typeof borderWidthMap;
	readonly borderStartEndRadius: typeof borderRadiusMap;
	readonly borderStartStartRadius: typeof borderRadiusMap;
	readonly borderTopColor: typeof borderColorMap;
	readonly borderTopLeftRadius: typeof borderRadiusMap;
	readonly borderTopRightRadius: typeof borderRadiusMap;
	readonly borderTopWidth: typeof borderWidthMap;
	readonly borderWidth: typeof borderWidthMap;
	readonly bottom: typeof allSpaceMap;
	readonly boxShadow: typeof shadowMap;
	readonly color: typeof textColorMap;
	readonly columnGap: typeof positiveSpaceMap;
	readonly font: typeof fontMap;
	readonly fontFamily: typeof fontFamilyMap;
	readonly fontWeight: typeof fontWeightMap;
	readonly gap: typeof positiveSpaceMap;
	readonly height: typeof dimensionMap;
	readonly inlineSize: typeof dimensionMap;
	readonly inset: typeof allSpaceMap;
	readonly insetBlock: typeof allSpaceMap;
	readonly insetBlockEnd: typeof allSpaceMap;
	readonly insetBlockStart: typeof allSpaceMap;
	readonly insetInline: typeof allSpaceMap;
	readonly insetInlineEnd: typeof allSpaceMap;
	readonly insetInlineStart: typeof allSpaceMap;
	readonly left: typeof allSpaceMap;
	readonly margin: typeof allSpaceMap;
	readonly marginBlock: typeof allSpaceMap;
	readonly marginBlockEnd: typeof allSpaceMap;
	readonly marginBlockStart: typeof allSpaceMap;
	readonly marginBottom: typeof allSpaceMap;
	readonly marginInline: typeof allSpaceMap;
	readonly marginInlineEnd: typeof allSpaceMap;
	readonly marginInlineStart: typeof allSpaceMap;
	readonly marginLeft: typeof allSpaceMap;
	readonly marginRight: typeof allSpaceMap;
	readonly marginTop: typeof allSpaceMap;
	readonly maxBlockSize: typeof dimensionMap;
	readonly maxHeight: typeof dimensionMap;
	readonly maxInlineSize: typeof dimensionMap;
	readonly maxWidth: typeof dimensionMap;
	readonly minBlockSize: typeof dimensionMap;
	readonly minHeight: typeof dimensionMap;
	readonly minInlineSize: typeof dimensionMap;
	readonly minWidth: typeof dimensionMap;
	readonly opacity: typeof opacityMap;
	readonly outlineColor: typeof borderColorMap;
	readonly outlineOffset: typeof allSpaceMap;
	readonly outlineWidth: typeof borderWidthMap;
	readonly padding: typeof positiveSpaceMap;
	readonly paddingBlock: typeof positiveSpaceMap;
	readonly paddingBlockEnd: typeof positiveSpaceMap;
	readonly paddingBlockStart: typeof positiveSpaceMap;
	readonly paddingBottom: typeof positiveSpaceMap;
	readonly paddingInline: typeof positiveSpaceMap;
	readonly paddingInlineEnd: typeof positiveSpaceMap;
	readonly paddingInlineStart: typeof positiveSpaceMap;
	readonly paddingLeft: typeof positiveSpaceMap;
	readonly paddingRight: typeof positiveSpaceMap;
	readonly paddingTop: typeof positiveSpaceMap;
	readonly right: typeof allSpaceMap;
	readonly rowGap: typeof positiveSpaceMap;
	readonly top: typeof allSpaceMap;
	readonly width: typeof dimensionMap;
	readonly zIndex: typeof layerMap;
} = {
	backgroundColor: backgroundColorMap,
	blockSize: dimensionMap,
	borderBlockColor: borderColorMap,
	borderBlockEndColor: borderColorMap,
	borderBlockEndWidth: borderWidthMap,
	borderBlockStartColor: borderColorMap,
	borderBlockStartWidth: borderWidthMap,
	borderBlockWidth: borderWidthMap,
	borderBottomColor: borderColorMap,
	borderBottomLeftRadius: borderRadiusMap,
	borderBottomRightRadius: borderRadiusMap,
	borderBottomWidth: borderWidthMap,
	borderColor: borderColorMap,
	borderEndEndRadius: borderRadiusMap,
	borderEndStartRadius: borderRadiusMap,
	borderInlineColor: borderColorMap,
	borderInlineEndColor: borderColorMap,
	borderInlineEndWidth: borderWidthMap,
	borderInlineStartColor: borderColorMap,
	borderInlineStartWidth: borderWidthMap,
	borderInlineWidth: borderWidthMap,
	borderLeftColor: borderColorMap,
	borderLeftWidth: borderWidthMap,
	borderRadius: borderRadiusMap,
	borderRightColor: borderColorMap,
	borderRightWidth: borderWidthMap,
	borderStartEndRadius: borderRadiusMap,
	borderStartStartRadius: borderRadiusMap,
	borderTopColor: borderColorMap,
	borderTopLeftRadius: borderRadiusMap,
	borderTopRightRadius: borderRadiusMap,
	borderTopWidth: borderWidthMap,
	borderWidth: borderWidthMap,
	bottom: allSpaceMap,
	boxShadow: shadowMap,
	color: textColorMap,
	columnGap: positiveSpaceMap,
	font: fontMap,
	fontFamily: fontFamilyMap,
	fontWeight: fontWeightMap,
	gap: positiveSpaceMap,
	height: dimensionMap,
	inlineSize: dimensionMap,
	inset: allSpaceMap,
	insetBlock: allSpaceMap,
	insetBlockEnd: allSpaceMap,
	insetBlockStart: allSpaceMap,
	insetInline: allSpaceMap,
	insetInlineEnd: allSpaceMap,
	insetInlineStart: allSpaceMap,
	left: allSpaceMap,
	margin: allSpaceMap,
	marginBlock: allSpaceMap,
	marginBlockEnd: allSpaceMap,
	marginBlockStart: allSpaceMap,
	marginBottom: allSpaceMap,
	marginInline: allSpaceMap,
	marginInlineEnd: allSpaceMap,
	marginInlineStart: allSpaceMap,
	marginLeft: allSpaceMap,
	marginRight: allSpaceMap,
	marginTop: allSpaceMap,
	maxBlockSize: dimensionMap,
	maxHeight: dimensionMap,
	maxInlineSize: dimensionMap,
	maxWidth: dimensionMap,
	minBlockSize: dimensionMap,
	minHeight: dimensionMap,
	minInlineSize: dimensionMap,
	minWidth: dimensionMap,
	opacity: opacityMap,
	outlineColor: borderColorMap,
	outlineOffset: allSpaceMap,
	outlineWidth: borderWidthMap,
	padding: positiveSpaceMap,
	paddingBlock: positiveSpaceMap,
	paddingBlockEnd: positiveSpaceMap,
	paddingBlockStart: positiveSpaceMap,
	paddingBottom: positiveSpaceMap,
	paddingInline: positiveSpaceMap,
	paddingInlineEnd: positiveSpaceMap,
	paddingInlineStart: positiveSpaceMap,
	paddingLeft: positiveSpaceMap,
	paddingRight: positiveSpaceMap,
	paddingTop: positiveSpaceMap,
	right: allSpaceMap,
	rowGap: positiveSpaceMap,
	top: allSpaceMap,
	width: dimensionMap,
	zIndex: layerMap,
} as const satisfies StrictTokensMap;
