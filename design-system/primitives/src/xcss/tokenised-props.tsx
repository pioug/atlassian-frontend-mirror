import type { CSSTokenMap } from '@atlaskit/tokens/token-names';

import type { AllSpace } from './all-space';
import type { BackgroundColor } from './background-color';
import type { BorderColor } from './border-color';
import type { BorderRadius } from './border-radius';
import type { BorderWidth } from './border-width';
import type { Dimension } from './dimension';
import type { Font } from './font';
import type { FontFamily } from './font-family';
import type { FontWeight } from './font-weight';
import type { Layer } from './layer';
import type { Opacity } from './opacity';
import type { Space } from './positive-space';
import type { Shadow } from './shadow';
import type { TextColor } from './text-color';

// Margin needs some bespoke types: https://atlassian.slack.com/archives/CKRHB23K8/p1712623192772909
type MarginSpace = AllSpace | 'auto' | '0';
type PaddingSpace = Space | '0';
type BorderWidthExtended = BorderWidth | 0 | '0';

/**
 * Token functions are currently allowed for borderRadius in xcss to ease migration.
 * Because 'radius.small' defaults to 3px, we need a mechanism to allow for 4px values to be provided:
 * This is done by calling the token function - token('radius.small')
 *
 * TODO: Remove once shape them is rolled out and fg platform-dst-shape-theme-default removed
 */
type BorderRadiusExtended = BorderRadius | 0 | '0' | 'inherit' | CSSTokenMap[BorderRadius];
type GlobalValue = 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';
type AutoComplete<T extends string> = T | Omit<string, T>;

export type TokenisedProps = {
	backgroundColor?: BackgroundColor;
	blockSize?: Dimension | string;
	borderBlockColor?: AutoComplete<BorderColor>;
	borderBlockEndColor?: AutoComplete<BorderColor>;
	borderBlockEndWidth?: BorderWidthExtended;
	borderBlockStartColor?: AutoComplete<BorderColor>;
	borderBlockStartWidth?: BorderWidthExtended;
	borderBlockWidth?: BorderWidthExtended;
	borderBottomColor?: AutoComplete<BorderColor>;
	borderBottomLeftRadius?: BorderRadiusExtended;
	borderBottomRightRadius?: BorderRadiusExtended;
	borderBottomWidth?: BorderWidthExtended;
	borderColor?: BorderColor;
	borderEndEndRadius?: BorderRadiusExtended;
	borderEndStartRadius?: BorderRadiusExtended;
	borderInlineColor?: AutoComplete<BorderColor>;
	borderInlineEndColor?: AutoComplete<BorderColor>;
	borderInlineEndWidth?: BorderWidthExtended;
	borderInlineStartColor?: AutoComplete<BorderColor>;
	borderInlineStartWidth?: BorderWidthExtended;
	borderInlineWidth?: BorderWidthExtended;
	borderLeftColor?: AutoComplete<BorderColor>;
	borderLeftWidth?: BorderWidthExtended;
	borderRadius?: BorderRadiusExtended;
	borderRightColor?: AutoComplete<BorderColor>;
	borderRightWidth?: BorderWidthExtended;
	borderStartEndRadius?: BorderRadiusExtended;
	borderStartStartRadius?: BorderRadiusExtended;
	borderTopColor?: AutoComplete<BorderColor>;
	borderTopLeftRadius?: BorderRadiusExtended;
	borderTopRightRadius?: BorderRadiusExtended;
	borderTopWidth?: BorderWidthExtended;
	borderWidth?: BorderWidthExtended;
	bottom?: AutoComplete<AllSpace>;
	boxShadow?: Shadow;
	color?: TextColor;
	columnGap?: Space;
	font?: Font | GlobalValue;
	fontFamily?: FontFamily | GlobalValue;
	fontStyle?: 'normal' | 'italic';
	fontWeight?: FontWeight | GlobalValue;
	gap?: Space;
	height?: Dimension | string;
	inlineSize?: Dimension | string;
	inset?: AutoComplete<AllSpace>;
	insetBlock?: AutoComplete<AllSpace>;
	insetBlockEnd?: AutoComplete<AllSpace>;
	insetBlockStart?: AutoComplete<AllSpace>;
	insetInline?: AutoComplete<AllSpace>;
	insetInlineEnd?: AutoComplete<AllSpace>;
	insetInlineStart?: AutoComplete<AllSpace>;
	left?: AutoComplete<AllSpace>;
	margin?: MarginSpace | '0 auto' | GlobalValue;
	marginBlock?: MarginSpace | GlobalValue;
	marginInline?: MarginSpace | GlobalValue;
	marginBlockEnd?: MarginSpace | GlobalValue;
	marginBlockStart?: MarginSpace | GlobalValue;
	marginBottom?: MarginSpace | GlobalValue;
	marginInlineEnd?: MarginSpace | GlobalValue;
	marginInlineStart?: MarginSpace | GlobalValue;
	marginLeft?: MarginSpace | GlobalValue;
	marginRight?: MarginSpace | GlobalValue;
	marginTop?: MarginSpace | GlobalValue;
	maxBlockSize?: Dimension | string;
	maxHeight?: Dimension | string;
	maxInlineSize?: Dimension | string;
	maxWidth?: Dimension | string;
	minBlockSize?: Dimension | string;
	minHeight?: Dimension | string;
	minInlineSize?: Dimension | string;
	minWidth?: Dimension | string;
	opacity?: AutoComplete<Opacity> | number;
	outlineColor?: BorderColor;
	outlineOffset?: AllSpace;
	outlineWidth?: BorderWidthExtended;
	padding?: PaddingSpace | GlobalValue;
	paddingBlock?: PaddingSpace | GlobalValue;
	paddingBlockEnd?: PaddingSpace | GlobalValue;
	paddingBlockStart?: PaddingSpace | GlobalValue;
	paddingBottom?: PaddingSpace | GlobalValue;
	paddingInline?: PaddingSpace | GlobalValue;
	paddingInlineEnd?: PaddingSpace | GlobalValue;
	paddingInlineStart?: PaddingSpace | GlobalValue;
	paddingLeft?: PaddingSpace | GlobalValue;
	paddingRight?: PaddingSpace | GlobalValue;
	paddingTop?: PaddingSpace | GlobalValue;
	right?: AutoComplete<AllSpace>;
	rowGap?: Space;
	top?: AutoComplete<AllSpace>;
	width?: Dimension | string;
	zIndex?: Layer;
};
