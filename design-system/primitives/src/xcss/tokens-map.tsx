import { allSpaceMap } from './all-space';
import { backgroundColorMap } from './background-color';
import { borderColorMap } from './border-color';
import { borderRadiusMap } from './border-radius';
import { borderWidthMap } from './border-width';
import { dimensionMap } from './dimension';
import { fontMap } from './font';
import { fontFamilyMap } from './font-family';
import { fontWeightMap } from './font-weight';
import { gapSpaceMap } from './gap-space';
import { layerMap } from './layer';
import { marginSpaceMap } from './margin-space';
import { opacityMap } from './opacity';
import { paddingSpaceMap } from './padding-space';
import type { positiveSpaceMap } from './positive-space';
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
		| typeof marginSpaceMap
		| typeof layerMap
		| typeof opacityMap
		| typeof paddingSpaceMap
		| typeof positiveSpaceMap
		| typeof gapSpaceMap
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
	readonly columnGap: typeof gapSpaceMap;
	readonly font: typeof fontMap;
	readonly fontFamily: typeof fontFamilyMap;
	readonly fontWeight: typeof fontWeightMap;
	readonly gap: typeof gapSpaceMap;
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
	readonly margin: typeof marginSpaceMap;
	readonly marginBlock: typeof marginSpaceMap;
	readonly marginBlockEnd: typeof marginSpaceMap;
	readonly marginBlockStart: typeof marginSpaceMap;
	readonly marginBottom: typeof marginSpaceMap;
	readonly marginInline: typeof marginSpaceMap;
	readonly marginInlineEnd: typeof marginSpaceMap;
	readonly marginInlineStart: typeof marginSpaceMap;
	readonly marginLeft: typeof marginSpaceMap;
	readonly marginRight: typeof marginSpaceMap;
	readonly marginTop: typeof marginSpaceMap;
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
	readonly padding: typeof paddingSpaceMap;
	readonly paddingBlock: typeof paddingSpaceMap;
	readonly paddingBlockEnd: typeof paddingSpaceMap;
	readonly paddingBlockStart: typeof paddingSpaceMap;
	readonly paddingBottom: typeof paddingSpaceMap;
	readonly paddingInline: typeof paddingSpaceMap;
	readonly paddingInlineEnd: typeof paddingSpaceMap;
	readonly paddingInlineStart: typeof paddingSpaceMap;
	readonly paddingLeft: typeof paddingSpaceMap;
	readonly paddingRight: typeof paddingSpaceMap;
	readonly paddingTop: typeof paddingSpaceMap;
	readonly right: typeof allSpaceMap;
	readonly rowGap: typeof gapSpaceMap;
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
	columnGap: gapSpaceMap,
	font: fontMap,
	fontFamily: fontFamilyMap,
	fontWeight: fontWeightMap,
	gap: gapSpaceMap,
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
	margin: marginSpaceMap,
	marginBlock: marginSpaceMap,
	marginBlockEnd: marginSpaceMap,
	marginBlockStart: marginSpaceMap,
	marginBottom: marginSpaceMap,
	marginInline: marginSpaceMap,
	marginInlineEnd: marginSpaceMap,
	marginInlineStart: marginSpaceMap,
	marginLeft: marginSpaceMap,
	marginRight: marginSpaceMap,
	marginTop: marginSpaceMap,
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
	padding: paddingSpaceMap,
	paddingBlock: paddingSpaceMap,
	paddingBlockEnd: paddingSpaceMap,
	paddingBlockStart: paddingSpaceMap,
	paddingBottom: paddingSpaceMap,
	paddingInline: paddingSpaceMap,
	paddingInlineEnd: paddingSpaceMap,
	paddingInlineStart: paddingSpaceMap,
	paddingLeft: paddingSpaceMap,
	paddingRight: paddingSpaceMap,
	paddingTop: paddingSpaceMap,
	right: allSpaceMap,
	rowGap: gapSpaceMap,
	top: allSpaceMap,
	width: dimensionMap,
	zIndex: layerMap,
} as const satisfies StrictTokensMap;
