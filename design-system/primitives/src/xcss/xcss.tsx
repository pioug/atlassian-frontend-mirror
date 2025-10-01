// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css as cssEmotion } from '@emotion/react';
import type {
	CSSInterpolation,
	CSSObject,
	CSSPropertiesWithMultiValues,
	SerializedStyles,
} from '@emotion/serialize';
import type * as CSS from 'csstype';

import type { StrictXCSSProp, XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';

import type { MediaQuery } from '../responsive/types';

import {
	allSpaceMap,
	backgroundColorMap,
	borderColorMap,
	borderRadiusMap,
	borderWidthMap,
	dimensionMap,
	fontFamilyMap,
	fontMap,
	fontWeightMap,
	layerMap,
	opacityMap,
	positiveSpaceMap,
	shadowMap,
	textColorMap,
	type TokenisedProps,
} from './style-maps.partial';

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

type StyleMapKey = keyof typeof tokensMap;
type TokensMapKey = keyof (typeof tokensMap)[StyleMapKey];

const uniqueSymbol: unique symbol = Symbol('UNSAFE_INTERNAL_styles');

const isSafeEnvToThrow = () =>
	typeof process === 'object' &&
	typeof process.env === 'object' &&
	process.env.NODE_ENV !== 'production';

const reNestedSelectors = /(\.|\s|&+|\*\>|#|\[.*\])/;
const safeSelectors = /^@media .*$|^::?.*$|^@supports .*$/;

const transformStyles = (
	styleObj?: CSSObject | CSSObject[],
): CSSObject | CSSObject[] | undefined => {
	if (!styleObj || typeof styleObj !== 'object') {
		return styleObj;
	}

	// If styles are defined as a CSSObject[], recursively call on each element until we reach CSSObject
	if (Array.isArray(styleObj)) {
		return styleObj.map(transformStyles) as CSSObject[];
	}

	// Modifies styleObj in place. Be careful.
	Object.entries(styleObj).forEach(([key, value]: [string, CSSInterpolation]) => {
		// If key is a pseudo class or a pseudo element, then value should be an object.
		// So, call transformStyles on the value
		if (typeof value === 'object' && safeSelectors.test(key)) {
			styleObj[key] = transformStyles(value as CSSObject);
			return;
		}

		if (isSafeEnvToThrow()) {
			// We don't support `.class`, `[data-testid]`, `> *`, `#some-id`
			if (reNestedSelectors.test(key)) {
				throw new Error(`Styles not supported for key '${key}'.`);
			}
		}

		// We have now dealt with all the special cases, so,
		// check whether what remains is a style property
		// that can be transformed.
		if (!(key in tokensMap)) {
			return;
		}

		const tokenValue = tokensMap[key as StyleMapKey][value as TokensMapKey];

		styleObj[key] = tokenValue ?? value;
	});

	return styleObj;
};

const baseXcss = (style?: SafeCSSObject | SafeCSSObject[]) => {
	const transformedStyles = transformStyles(style as CSSObject);

	return {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[uniqueSymbol]: cssEmotion(transformedStyles as CSSInterpolation) as SerializedStyles,
	} as const;
};

/**
 * Picks out runtime XCSS objects and build-time XCSS strings. This is needed
 * to supported both Emotion and Compiled styles until we've fully migrated
 * to Compiled.
 *
 * @private
 * @deprecated
 */
export const parseXcss = (
	args:
		| XCSS
		| (XCSS | false | undefined)[]
		| undefined
		| StrictXCSSProp<XCSSAllProperties, XCSSAllPseudos>,
): { emotion?: SerializedStyles[]; static?: string } => {
	if (Array.isArray(args)) {
		const emotion: SerializedStyles[] = [];
		const staticArr: string[] = [];

		for (const arg of args) {
			const result = parseXcss(arg);

			if (result.emotion) {
				emotion.push(...result.emotion);
			}

			if (result.static) {
				staticArr.push(result.static);
			}
		}

		return {
			emotion,
			static: staticArr.join(' '),
		};
	}

	const objArgs = args as XCSS | undefined;
	const { [uniqueSymbol]: styles } = objArgs || {};

	if (styles) {
		return { emotion: [styles] };
	}

	if (args) {
		// We use string interpolation here instead of .toString() just
		// in case the resulting object doesn't have the method available.
		const stringifiedArgs = `${args}`;
		if (stringifiedArgs) {
			return { static: stringifiedArgs };
		}
	}

	return {};
};

type AllMedia =
	| MediaQuery
	| '@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)'
	| '@media (prefers-color-scheme: dark)'
	| '@media (prefers-color-scheme: light)'
	| '@media (prefers-reduced-motion: reduce)';

// Media queries should not contain nested media queries
type CSSMediaQueries = { [MQ in AllMedia]?: Omit<SafeCSSObject, AllMedia> };
// Allow only a specific subset of chained selectors to maintain workable TypeScript performance
type ChainedCSSPseudos =
	| ':visited:active'
	| ':visited:hover'
	| ':active:visited'
	| ':hover::before'
	| ':focus::before'
	| ':hover::after'
	| ':focus-visible::before'
	| ':focus-visible::after'
	| ':focus:not(:focus-visible)';
// Pseudos should not contain nested pseudos, or media queries
type CSSPseudos = {
	[Pseudo in CSS.Pseudos | ChainedCSSPseudos]?: Omit<SafeCSSObject, CSS.Pseudos | AllMedia>;
};

type AtRulesWithoutMedia = Exclude<CSS.AtRules, '@media'>;

type CSSAtRules = {
	[AtRule in AtRulesWithoutMedia as `${AtRule}${string}`]?: Omit<
		SafeCSSObject,
		AtRulesWithoutMedia
	>;
};
type SafeCSSObject = CSSPseudos &
	CSSAtRules &
	TokenisedProps &
	CSSMediaQueries &
	Omit<CSSPropertiesWithMultiValues, keyof TokenisedProps>;

export type XCSS = ReturnType<typeof xcss>;

/**
 * ### xcss
 *
 * `xcss` is a safer, tokens-first approach to CSS-in-JS. It allows token-backed values for
 * CSS application.
 *
 * ```tsx
 * const styles = xcss({
 *   padding: 'space.100'
 * })
 * ```
 */
export function xcss(style: SafeCSSObject): {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	readonly [uniqueSymbol]: SerializedStyles;
} {
	return baseXcss(style);
}
