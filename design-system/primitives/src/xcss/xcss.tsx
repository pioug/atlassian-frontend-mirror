/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css as cssEmotion } from '@emotion/react';
import {
  CSSInterpolation,
  CSSObject,
  CSSPropertiesWithMultiValues,
  SerializedStyles,
} from '@emotion/serialize';
import type * as CSS from 'csstype';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import { media } from '../helpers/responsive';
import { MediaQuery } from '../helpers/responsive/types';
import { Box, Inline } from '../index';

import {
  backgroundColorMap,
  borderColorMap,
  borderRadiusMap,
  borderWidthMap,
  dimensionMap,
  layerMap,
  shadowMap,
  spaceMap,
  textColorMap,
  TokenisedProps,
} from './style-maps.partial';

const tokensMap = {
  backgroundColor: backgroundColorMap,
  blockSize: dimensionMap,
  borderColor: borderColorMap,
  borderRadius: borderRadiusMap,
  borderWidth: borderWidthMap,
  bottom: spaceMap,
  boxShadow: shadowMap,
  color: textColorMap,
  columnGap: spaceMap,
  gap: spaceMap,
  height: dimensionMap,
  inlineSize: dimensionMap,
  inset: spaceMap,
  insetBlock: spaceMap,
  insetBlockEnd: spaceMap,
  insetBlockStart: spaceMap,
  insetInline: spaceMap,
  insetInlineEnd: spaceMap,
  insetInlineStart: spaceMap,
  margin: spaceMap,
  marginBlock: spaceMap,
  marginBlockEnd: spaceMap,
  marginBlockStart: spaceMap,
  marginInline: spaceMap,
  marginInlineEnd: spaceMap,
  marginInlineStart: spaceMap,
  left: spaceMap,
  maxBlockSize: dimensionMap,
  maxHeight: dimensionMap,
  maxInlineSize: dimensionMap,
  maxWidth: dimensionMap,
  minBlockSize: dimensionMap,
  minHeight: dimensionMap,
  minInlineSize: dimensionMap,
  minWidth: dimensionMap,
  outlineOffset: spaceMap,
  outlineWidth: borderWidthMap,
  outlineColor: borderColorMap,
  padding: spaceMap,
  paddingBlock: spaceMap,
  paddingBlockEnd: spaceMap,
  paddingBlockStart: spaceMap,
  paddingBottom: spaceMap,
  paddingInline: spaceMap,
  paddingInlineEnd: spaceMap,
  paddingInlineStart: spaceMap,
  paddingLeft: spaceMap,
  paddingRight: spaceMap,
  paddingTop: spaceMap,
  right: spaceMap,
  rowGap: spaceMap,
  top: spaceMap,
  width: dimensionMap,
  zIndex: layerMap,
} as const;

type StyleMapKey = keyof typeof tokensMap;
type TokensMapKey = keyof (typeof tokensMap)[StyleMapKey];

const uniqueSymbol = Symbol('UNSAFE_INTERNAL_styles');

const isSafeEnvToThrow = () =>
  typeof process === 'object' &&
  typeof process.env === 'object' &&
  process.env.NODE_ENV !== 'production';

const reNestedSelectors = /(\.|\s|&+|\*\>|#|\[.*\])/;
const rePseudos = /^::?.*$/;

const reMediaQuery = /^@media .*$/;

/**
 * Reduce our media queries into a safe string for regex comparison.
 */
const reValidMediaQuery = new RegExp(
  `^(${Object.values(media.above)
    .map(
      (mediaQuery: MediaQuery) => mediaQuery.replace(/[.()]/g, '\\$&'), // Escape the ".", "(", and ")" in the media query syntax.
    )
    .join('|')})$`,
);

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
      if (isSafeEnvToThrow()) {
        // We don't support `.class`, `[data-testid]`, `> *`, `#some-id`
        if (reNestedSelectors.test(key) && !reValidMediaQuery.test(key)) {
          throw new Error(`Styles not supported for key '${key}'.`);
        }
      }

      // If key is a pseudo class or a pseudo element, then value should be an object.
      // So, call transformStyles on the value
      if (rePseudos.test(key)) {
        styleObj[key] = transformStyles(value as CSSObject);
        return;
      }

      if (reMediaQuery.test(key)) {
        // @ts-expect-error
        styleObj[key] = transformStyles(value as CSSMediaQueries[MediaQuery]);
        return;
      }

      // We have now dealt with all the special cases, so,
      // check whether what remains is a style property
      // that can be transformed.
      if (!(key in tokensMap)) {
        return;
      }

      const tokenValue = tokensMap[key as StyleMapKey][value as TokensMapKey];
      if (
        !tokenValue &&
        typeof process &&
        process.env.NODE_ENV === 'development'
      ) {
        const message = `Invalid token alias: ${key}: ${value}`;
        warnOnce(message);
      }

      styleObj[key] = tokenValue ?? value;
    },
  );

  return styleObj;
};

const baseXcss = <T,>(style?: SafeCSSObject | SafeCSSObject[]) => {
  const transformedStyles = transformStyles(style as CSSObject);

  return {
    [uniqueSymbol]: cssEmotion(
      transformedStyles as CSSInterpolation,
    ) as unknown as T,
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
  args: XCSS | Array<XCSS | false | undefined>,
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

// Media queries should not contain nested media queries
type CSSMediaQueries = { [MQ in MediaQuery]?: Omit<SafeCSSObject, MediaQuery> };
// Pseudos should not contain nested pseudos, or media queries
type CSSPseudos = {
  [Pseudo in CSS.Pseudos]?: Omit<SafeCSSObject, CSS.Pseudos | MediaQuery>;
};
type SafeCSSObject = CSSPseudos &
  TokenisedProps &
  CSSMediaQueries &
  Omit<CSSPropertiesWithMultiValues, keyof TokenisedProps>;

type ScopedSafeCSSObject<T extends keyof SafeCSSObject> = Pick<
  SafeCSSObject,
  T
>;

// unused private functions only so we can extract the return type from a generic function
const boxWrapper = (style: any) => xcss<typeof Box>(style);
const inlineWrapper = (style: any) => xcss<typeof Inline>(style);

type XCSS = ReturnType<typeof boxWrapper> | ReturnType<typeof inlineWrapper>;

type AllowedBoxStyles = keyof SafeCSSObject;
type Spacing =
  | 'columnGap'
  | 'gap'
  | 'inset'
  | 'insetBlock'
  | 'insetBlockEnd'
  | 'insetBlockStart'
  | 'insetInline'
  | 'insetInlineEnd'
  | 'insetInlineStart'
  | 'margin'
  | 'marginBlock'
  | 'marginBlockEnd'
  | 'marginBlockStart'
  | 'marginInline'
  | 'marginInlineEnd'
  | 'marginInlineStart'
  | 'outlineOffset'
  | 'padding'
  | 'paddingBlock'
  | 'paddingBlockEnd'
  | 'paddingBlockStart'
  | 'paddingBottom'
  | 'paddingInline'
  | 'paddingInlineEnd'
  | 'paddingInlineStart'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingTop'
  | 'rowGap';

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
export function xcss<Primitive extends typeof Box | typeof Inline = typeof Box>(
  style: Primitive extends typeof Box
    ?
        | ScopedSafeCSSObject<AllowedBoxStyles>
        | ScopedSafeCSSObject<AllowedBoxStyles>[]
    : Primitive extends typeof Inline
    ? ScopedSafeCSSObject<Spacing> | ScopedSafeCSSObject<Spacing>[]
    : never,
) {
  return baseXcss<
    Primitive extends typeof Box
      ? BoxStyles
      : Primitive extends typeof Inline
      ? InlineStyles
      : never
  >(style);
}

declare const boxTag: unique symbol;
export type BoxStyles = SerializedStyles & {
  [boxTag]: true;
};
export type BoxXCSS = {
  readonly [uniqueSymbol]: BoxStyles;
};

declare const inlineTag: unique symbol;
export type InlineStyles = SerializedStyles & {
  [inlineTag]: true;
};
export type InlineXCSS = {
  readonly [uniqueSymbol]: InlineStyles;
};
