/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css as cssEmotion } from '@emotion/react';
import {
  CSSInterpolation,
  CSSObject,
  CSSPropertiesWithMultiValues,
  CSSPseudos,
  SerializedStyles,
} from '@emotion/serialize';

import { Box, Inline } from '../index';

import {
  backgroundColorMap,
  borderColorMap,
  borderRadiusMap,
  borderWidthMap,
  dimensionMap,
  paddingMap,
  textColorMap,
  TokenisedProps,
} from './style-maps';

const tokensMap = {
  backgroundColor: backgroundColorMap,
  borderColor: borderColorMap,
  borderRadius: borderRadiusMap,
  borderWidth: borderWidthMap,
  color: textColorMap,
  height: dimensionMap,
  maxHeight: dimensionMap,
  maxWidth: dimensionMap,
  minHeight: dimensionMap,
  minWidth: dimensionMap,
  padding: paddingMap,
  paddingBlock: paddingMap,
  paddingBlockEnd: paddingMap,
  paddingBlockStart: paddingMap,
  paddingInline: paddingMap,
  paddingInlineEnd: paddingMap,
  paddingInlineStart: paddingMap,
  width: dimensionMap,
} as const;

type StyleMapKey = keyof typeof tokensMap;
type TokensMapKey = keyof typeof tokensMap[StyleMapKey];

const uniqueSymbol = Symbol(
  'Internal symbol to verify xcss function is called safely',
);

/**
 * Only exposed for testing.
 * @internal
 */
export const transformStyles = (
  styleObj?: CSSObject | CSSObject[],
): CSSObject | CSSObject[] | undefined => {
  if (!styleObj || typeof styleObj !== 'object') {
    return styleObj;
  }

  // If styles are defined as an CSSObject[], recursively call on each element until we reach CSSObject
  if (Array.isArray(styleObj)) {
    return styleObj.map(transformStyles) as CSSObject[];
  }

  // Modifies styleObj in place. Be careful.
  Object.entries(styleObj).forEach(
    ([key, value]: [string, CSSInterpolation]) => {
      if (process?.env?.NODE_ENV === 'development') {
        // We don't support `.class`, `[data-testid]`, `> *`, `#some-id`
        if (/(\.|\s|&+|\*\>|#|\[.*\])/.test(key)) {
          throw new Error(`Styles not supported for key '${key}'.`);
        }
      }

      // If key is a pseudo class or a pseudo element, then value should be an object.
      // So, call transformStyles on the value
      if (/^::?.*$/.test(key)) {
        styleObj[key] = transformStyles(value as CSSObject);
        return;
      }

      // TODO: Deal with media queries

      // We have now dealt with all the special cases, so,
      // check whether what remains is a style property
      // that can be transformed.
      if (!(key in tokensMap)) {
        return;
      }

      const tokenValue = tokensMap[key as StyleMapKey][value as TokensMapKey];
      if (!tokenValue) {
        throw new Error('Invalid Token');
      }

      styleObj[key] = tokenValue;
    },
  );

  return styleObj;
};

const baseXcss = <T,>(style?: SafeCSSObject | SafeCSSObject[]) => {
  const transformedStyles = transformStyles(style);

  return {
    symbol: uniqueSymbol,
    styles: cssEmotion(transformedStyles as CSSInterpolation) as unknown as T,
  } as const;
};

/**
 * @internal used in primitives
 * @returns
 */
export const parseXcss = (args: SafeCSS): ReturnType<typeof cssEmotion> => {
  if (Array.isArray(args)) {
    // @ts-expect-error FIXME
    return args.map(parseXcss);
  }

  const { symbol, styles } = args;

  if (
    typeof process &&
    process.env.NODE_ENV === 'development' &&
    symbol !== uniqueSymbol
  ) {
    throw new Error(
      'Styles generated from unsafe source, use the `xcss` export from `@atlaskit/primitives`.',
    );
  }

  return styles as SerializedStyles;
};

type SafeCSSObject = CSSPseudos &
  TokenisedProps &
  Omit<CSSPropertiesWithMultiValues, keyof TokenisedProps>;

type ScopedSafeCSSObject<T extends keyof SafeCSSObject> = Pick<
  SafeCSSObject,
  T
>;

// unused private functions only so we can extract the return type from a generic function
const boxWrapper = (style: any) => xcss<typeof Box>(style);
const inlineWrapper = (style: any) => xcss<typeof Inline>(style);

type XCSS = ReturnType<typeof boxWrapper> | ReturnType<typeof inlineWrapper>;
type SafeCSS = XCSS | XCSS[];

type AllowedBoxStyles = keyof SafeCSSObject;
type AllowedInlineStyles = 'backgroundColor' | 'padding';

export function xcss<Primitive extends typeof Box | typeof Inline = typeof Box>(
  style: Primitive extends typeof Box
    ? ScopedSafeCSSObject<AllowedBoxStyles>
    : Primitive extends typeof Inline
    ? ScopedSafeCSSObject<AllowedInlineStyles>
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
  readonly symbol: typeof uniqueSymbol;
  readonly styles: BoxStyles;
};

declare const inlineTag: unique symbol;
export type InlineStyles = SerializedStyles & {
  [inlineTag]: true;
};
export type InlineXCSS = {
  readonly symbol: typeof uniqueSymbol;
  readonly styles: InlineStyles;
};
