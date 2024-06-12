/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BoxProps
 *
 * @codegen <<SignedSource::ff889836988991365ebf829e9793e10d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/box/__generated__/index.partial.tsx <<SignedSource::c2e0a3f5394718d7a9864acb3ffccd00>>
 */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */

import React from 'react';
import { Box as PlatformBox } from '@atlaskit/primitives';

import type { CSSProperties } from '@emotion/serialize';
import type * as CSS from 'csstype';
import type { MediaQuery } from '@atlaskit/primitives';
import { tokensMap } from '@atlaskit/primitives';
type TokensMap = typeof tokensMap;
type TokensMapPropKey = keyof TokensMap;
type TokenizedProps = {
    [K in TokensMapPropKey]?: keyof TokensMap[K];
};
type RawCSSValue = string & {};
type RelaxedTokenizedProps = {
    [K in TokensMapPropKey]?: keyof TokensMap[K] | RawCSSValue;
};
type AllMedia = MediaQuery | '@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)' | '@media (prefers-color-scheme: dark)' | '@media (prefers-color-scheme: light)' | '@media (prefers-reduced-motion: reduce)';
type StandardCSSProps = Omit<CSSProperties, TokensMapPropKey>;
type RestrictedPropsSpec = RelaxedTokenizedProps & StandardCSSProps;
type SafeCSSObject<SupportedPropKeys extends keyof CSSProperties = keyof CSSProperties, RawCSSPropKeys extends SupportedPropKeys = SupportedPropKeys, RestrictedProps extends RestrictedPropsSpec = RestrictedPropsSpec> = {
    [MQ in AllMedia]?: Omit<SafeCSSObject<SupportedPropKeys, RawCSSPropKeys, RestrictedPropsSpec>, AllMedia>;
} & {
    [Pseudo in CSS.Pseudos]?: Omit<SafeCSSObject<SupportedPropKeys, RawCSSPropKeys, RestrictedPropsSpec>, CSS.Pseudos | AllMedia>;
} & Pick<TokenizedProps, Exclude<Extract<SupportedPropKeys, TokensMapPropKey>, RawCSSPropKeys | keyof RestrictedProps>> & Pick<StandardCSSProps, Exclude<Extract<SupportedPropKeys, keyof StandardCSSProps>, RawCSSPropKeys | keyof RestrictedProps>> & // force standard css prop values for allowCSS: true
Pick<CSSProperties, Extract<RawCSSPropKeys, keyof CSSProperties>> & RestrictedProps;
type XCSSValidatorParam = {
    [key in keyof CSSProperties]: true | {
        supportedValues: Array<RestrictedPropsSpec[key]>;
    } | {
        allowCSS: true;
    };
};
/**
 *
 * @param supportedXCSSProps - the list of css props to be supported for the intended component.
 *    If not provided, all the props will be supported. The props could be either standard css props
 *    or design token based props. If the prop is a design token based prop, the value of the prop
 *    will be validated against the design tokens map to ensure the value is a valid design token string.
 * @returns a function that takes a style object and returns a style object with only the supported props
 *    as specified in the supportedXCSSProps list. The props that are not supported will be removed from the
 *    returned style object and a warning will be logged in the console.
 */
declare const makeXCSSValidator: <U extends XCSSValidatorParam>(supportedXCSSProps: U) => (styleObj: SafeCSSObject<keyof CSSProperties, keyof CSSProperties, RestrictedPropsSpec> | SafeCSSObject<Extract<keyof U, keyof CSSProperties>, Extract<{ [K in Extract<keyof U, keyof CSSProperties>]: U[K] extends {
    allowCSS: true;
} ? K : never; }[Extract<keyof U, keyof CSSProperties>], Extract<keyof U, keyof CSSProperties>>, { [K_2 in Extract<{ [K_1 in Extract<keyof U, keyof CSSProperties>]: U[K_1] extends {
    supportedValues: RestrictedPropsSpec[K_1][];
} ? K_1 : never; }[Extract<keyof U, keyof CSSProperties>], Extract<keyof U, keyof CSSProperties>>]?: (U[K_2] extends {
    supportedValues: infer V;
} ? Exclude<V[keyof V], number | Function> : never) | undefined; }>) => SafeCSSObject<Extract<keyof U, keyof CSSProperties>, Extract<{ [K in Extract<keyof U, keyof CSSProperties>]: U[K] extends {
    allowCSS: true;
} ? K : never; }[Extract<keyof U, keyof CSSProperties>], Extract<keyof U, keyof CSSProperties>>, { [K_2 in Extract<{ [K_1 in Extract<keyof U, keyof CSSProperties>]: U[K_1] extends {
    supportedValues: RestrictedPropsSpec[K_1][];
} ? K_1 : never; }[Extract<keyof U, keyof CSSProperties>], Extract<keyof U, keyof CSSProperties>>]?: (U[K_2] extends {
    supportedValues: infer V;
} ? Exclude<V[keyof V], number | Function> : never) | undefined; }>;
export { makeXCSSValidator };
export type { SafeCSSObject };

const xcssValidator = makeXCSSValidator({
  // color related props
  color: true,
  boxShadow: true,
  opacity: true,
  backgroundColor: true,
  borderColor: true,
  borderBlockColor: true,
  borderBlockEndColor: true,
  borderBlockStartColor: true,
  borderBottomColor: true,
  borderInlineColor: true,
  borderInlineEndColor: true,
  borderInlineStartColor: true,
  borderLeftColor: true,
  borderRightColor: true,
  borderTopColor: true,

  // layout and space related props
  width: {
    allowCSS: true,
  },
  height: {
    allowCSS: true,
  },
  minWidth: {
    allowCSS: true,
  },
  maxWidth: {
    allowCSS: true,
  },
  minHeight: {
    allowCSS: true,
  },
  maxHeight: {
    allowCSS: true,
  },
  margin: true,
  marginBlock: true,
  marginBlockEnd: true,
  marginBlockStart: true,
  marginBottom: true,
  marginInline: true,
  marginInlineEnd: true,
  marginInlineStart: true,
  marginLeft: true,
  marginRight: true,
  marginTop: true,
  padding: true,
  paddingBlock: true,
  paddingBlockEnd: true,
  paddingBlockStart: true,
  paddingBottom: true,
  paddingInline: true,
  paddingInlineEnd: true,
  paddingInlineStart: true,
  paddingLeft: true,
  paddingRight: true,
  paddingTop: true,

  // other box related props
  borderRadius: { supportedValues: ['border.radius'] },
  borderBottomLeftRadius: { supportedValues: ['border.radius'] },
  borderBottomRightRadius: { supportedValues: ['border.radius'] },
  borderTopLeftRadius: { supportedValues: ['border.radius'] },
  borderTopRightRadius: { supportedValues: ['border.radius'] },
  borderEndEndRadius: { supportedValues: ['border.radius'] },
  borderEndStartRadius: { supportedValues: ['border.radius'] },
  borderStartEndRadius: { supportedValues: ['border.radius'] },
  borderStartStartRadius: { supportedValues: ['border.radius'] },
  borderWidth: { supportedValues: ['border.width'] },
  borderBlockWidth: { supportedValues: ['border.width'] },
  borderBlockEndWidth: { supportedValues: ['border.width'] },
  borderBlockStartWidth: { supportedValues: ['border.width'] },
  borderBottomWidth: { supportedValues: ['border.width'] },
  borderInlineWidth: { supportedValues: ['border.width'] },
  borderInlineEndWidth: { supportedValues: ['border.width'] },
  borderInlineStartWidth: { supportedValues: ['border.width'] },
  borderLeftWidth: { supportedValues: ['border.width'] },
  borderRightWidth: { supportedValues: ['border.width'] },
  borderTopWidth: { supportedValues: ['border.width'] },

  // other props not in tokens based props
  borderTopStyle: {
    supportedValues: ['dotted', 'dashed', 'solid', 'none', 'hidden'],
  },
  borderBottomStyle: {
    supportedValues: ['dotted', 'dashed', 'solid', 'none', 'hidden'],
  },
  borderRightStyle: {
    supportedValues: ['dotted', 'dashed', 'solid', 'none', 'hidden'],
  },
  borderLeftStyle: {
    supportedValues: ['dotted', 'dashed', 'solid', 'none', 'hidden'],
  },
  borderStyle: {
    supportedValues: ['dotted', 'dashed', 'solid', 'none', 'hidden'],
  },
  position: {
    supportedValues: ['relative', 'static'],
  },
});

type PlatformBoxProps = React.ComponentProps<typeof PlatformBox>;
type XCSSProp = ReturnType<typeof xcssValidator>;

export type BoxProps = Pick<
  PlatformBoxProps,
  | 'padding'
  | 'paddingBlock'
  | 'paddingBlockStart'
  | 'paddingBlockEnd'
  | 'paddingInline'
  | 'paddingInlineStart'
  | 'paddingInlineEnd'
  | 'backgroundColor'
  | 'children'
  | 'ref'
  | 'testId'
  | 'role'
> & {
  xcss?: XCSSProp;
};