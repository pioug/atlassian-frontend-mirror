/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css as cssEmotion } from '@emotion/react';
import type {
  CSSInterpolation,
  CSSObject,
  CSSPropertiesWithMultiValues,
  SerializedStyles,
} from '@emotion/serialize';
// eslint-disable-next-line import/no-extraneous-dependencies
import type * as CSS from 'csstype';

import type { MediaQuery } from '../responsive/types';

import {
  allSpaceMap,
  backgroundColorMap,
  borderColorMap,
  borderRadiusMap,
  borderWidthMap,
  dimensionMap,
  layerMap,
  opacityMap,
  positiveSpaceMap,
  shadowMap,
  textColorMap,
  TokenisedProps,
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
    | typeof textColorMap;
};
export const tokensMap = {
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
  outlineOffset: positiveSpaceMap,
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

const uniqueSymbol = Symbol('UNSAFE_INTERNAL_styles');

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
  Object.entries(styleObj).forEach(
    ([key, value]: [string, CSSInterpolation]) => {
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
    },
  );

  return styleObj;
};

const baseXcss = (style?: SafeCSSObject | SafeCSSObject[]) => {
  const transformedStyles = transformStyles(style as CSSObject);

  return {
    [uniqueSymbol]: cssEmotion(
      transformedStyles as CSSInterpolation,
    ) as SerializedStyles,
  } as const;
};

/**
 * @internal used in primitives
 * @returns a collection of styles that can be applied to the respective primitive
 */
type ParsedXcss =
  | ReturnType<typeof cssEmotion>
  | ReturnType<typeof cssEmotion>[];
export const parseXcss = (
  args: XCSS | (XCSS | false | undefined)[],
): ParsedXcss => {
  if (Array.isArray(args)) {
    return args.map(x => x && parseXcss(x)).filter(Boolean) as ParsedXcss;
  }

  const { [uniqueSymbol]: styles } = args;

  if (
    typeof process &&
    process.env.NODE_ENV === 'development' &&
    typeof styles === 'undefined'
  ) {
    throw new Error(
      'Styles generated from unsafe source, use the `xcss` export from `@atlaskit/primitives`.',
    );
  }

  return styles;
};

type AllMedia =
  | MediaQuery
  | '@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)'
  | '@media (prefers-color-scheme: dark)'
  | '@media (prefers-color-scheme: light)'
  | '@media (prefers-reduced-motion: reduce)';

// Media queries should not contain nested media queries
type CSSMediaQueries = { [MQ in AllMedia]?: Omit<SafeCSSObject, AllMedia> };
// Pseudos should not contain nested pseudos, or media queries
type CSSPseudos = {
  [Pseudo in CSS.Pseudos]?: Omit<SafeCSSObject, CSS.Pseudos | AllMedia>;
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
export function xcss(style: SafeCSSObject) {
  return baseXcss(style);
}
