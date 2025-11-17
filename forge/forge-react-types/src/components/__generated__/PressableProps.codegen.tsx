/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - PressableProps
 *
 * @codegen <<SignedSource::7158030e15c00ca33456e783cffd4db2>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/pressable/index.tsx <<SignedSource::e23b1db22ac327f82c64213c36751b27>>
 */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */

import React from 'react';
import { Pressable as PlatformPressable } from '@atlaskit/primitives';

import type * as CSS from 'csstype';
import type { MediaQuery } from '@atlaskit/primitives';
import { tokensMap } from '@atlaskit/primitives';
type CSSProperties = CSS.PropertiesFallback<number | string>;
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

import type { BorderRadius } from '@atlaskit/primitives';
const borderRadiusTokens: BorderRadius[] = [
	'radius.xsmall',
	'radius.small',
	'radius.medium',
	'radius.large',
	'radius.xlarge',
	'radius.full',
	'radius.tile',
];
const borderRadiusSupportedValues = [...borderRadiusTokens, 'border.radius'];
const xcssValidator = makeXCSSValidator({
	// text related props
	textAlign: {
		allowCSS: true,
	},

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

	overflow: {
		supportedValues: ['hidden', 'visible', 'scroll', 'auto'],
	},

	overflowX: {
		supportedValues: ['hidden', 'visible', 'scroll', 'auto'],
	},
	overflowY: {
		supportedValues: ['hidden', 'visible', 'scroll', 'auto'],
	},

	// layout and space related props
	display: {
		supportedValues: ['block', 'inline-block', 'inline', 'none'],
	},
	flexGrow: {
		allowCSS: true,
	},
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
	borderRadius: { supportedValues: borderRadiusSupportedValues },
	borderBottomLeftRadius: { supportedValues: borderRadiusSupportedValues },
	borderBottomRightRadius: { supportedValues: borderRadiusSupportedValues },
	borderTopLeftRadius: { supportedValues: borderRadiusSupportedValues },
	borderTopRightRadius: { supportedValues: borderRadiusSupportedValues },
	borderEndEndRadius: { supportedValues: borderRadiusSupportedValues },
	borderEndStartRadius: { supportedValues: borderRadiusSupportedValues },
	borderStartEndRadius: { supportedValues: borderRadiusSupportedValues },
	borderStartStartRadius: { supportedValues: borderRadiusSupportedValues },
	borderWidth: true,
	borderBlockWidth: true,
	borderBlockEndWidth: true,
	borderBlockStartWidth: true,
	borderBottomWidth: true,
	borderInlineWidth: true,
	borderInlineEndWidth: true,
	borderInlineStartWidth: true,
	borderLeftWidth: true,
	borderRightWidth: true,
	borderTopWidth: true,

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
type XCSSProp = ReturnType<typeof xcssValidator>;

type PlatformPressableProps = React.ComponentProps<typeof PlatformPressable>;

export type PressableProps = Pick<PlatformPressableProps, 'children' | 'ref' | 'testId'> & {
	/**
	 * Token representing background color with a built-in fallback value.
	 */
	backgroundColor?: PlatformPressableProps['backgroundColor'];
	/**
	 * Whether the button is disabled.
	 */
	isDisabled?: PlatformPressableProps['isDisabled'];
	/**
	 * Handler called on click.
	 */
	onClick?: () => void;
	/**
	 * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
	 *
	 * @see paddingBlock
	 * @see paddingInline
	 */
	padding?: PlatformPressableProps['padding'];
	/**
	 * Tokens representing CSS shorthand `paddingBlock`.
	 *
	 * @see paddingBlockStart
	 * @see paddingBlockEnd
	 */
	paddingBlock?: PlatformPressableProps['paddingBlock'];
	/**
	 * Tokens representing CSS `paddingBlockEnd`.
	 */
	paddingBlockEnd?: PlatformPressableProps['paddingBlockEnd'];
	/**
	 * Tokens representing CSS `paddingBlockStart`.
	 */
	paddingBlockStart?: PlatformPressableProps['paddingBlockStart'];
	/**
	 * Tokens representing CSS shorthand `paddingInline`.
	 *
	 * @see paddingInlineStart
	 * @see paddingInlineEnd
	 */
	paddingInline?: PlatformPressableProps['paddingInline'];
	/**
	 * Tokens representing CSS `paddingInlineEnd`.
	 */
	paddingInlineEnd?: PlatformPressableProps['paddingInlineEnd'];
	/**
	 * Tokens representing CSS `paddingInlineStart`.
	 */
	paddingInlineStart?: PlatformPressableProps['paddingInlineStart'];
	/**
	 * Apply a subset of permitted styles, powered by Atlassian Design System tokens.
	 * For a list of supported style properties on this component, see [here](https://developer.atlassian.com/platform/forge/ui-kit/components/xcss).
	 *
	 * @type XCSSProp
	 */
	xcss?: XCSSProp;
};

/**
 * A pressable is a primitive for building custom buttons.
 *
 * @see [Pressable](https://developer.atlassian.com/platform/forge/ui-kit/components/pressable/) in UI Kit documentation for more information
 */
export type TPressable<T> = (props: PressableProps) => T;