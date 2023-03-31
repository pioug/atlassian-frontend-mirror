import { css as cssEmotion } from '@emotion/react';
import {
  CSSInterpolation,
  CSSObject,
  CSSPropertiesWithMultiValues,
  CSSPseudos,
} from '@emotion/serialize';

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

type XCSS = ReturnType<typeof xcss>;
export type SafeCSS = XCSS | XCSS[];

export type SafeCSSObject = CSSPseudos &
  TokenisedProps &
  Omit<CSSPropertiesWithMultiValues, keyof TokenisedProps>;

export const xcss = (style?: SafeCSSObject | SafeCSSObject[]) => {
  const transformedStyles = transformStyles(style);

  return {
    symbol: uniqueSymbol,
    styles: cssEmotion(transformedStyles as CSSInterpolation),
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

  return styles;
};
