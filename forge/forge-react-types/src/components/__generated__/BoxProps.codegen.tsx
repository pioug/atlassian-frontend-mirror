/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BoxProps
 *
 * @codegen <<SignedSource::2aa8902478f587c656a335fdbf945043>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/box/__generated__/index.partial.tsx <<SignedSource::8e5857e8580db0dac17ebc42ab6115c9>>
 */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */

import React from 'react';
import { Box as PlatformBox } from '@atlaskit/primitives';

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

type PlatformBoxProps = React.ComponentProps<typeof PlatformBox>;

export type BoxProps = Pick<PlatformBoxProps, 'children' | 'ref' | 'testId'> & {
	/**
	 * A shorthand for `paddingBlock` and `paddingInline` together.
	 *
	 * @type [Space tokens](https://atlassian.design/components/tokens/all-tokens#space)
	 */
	padding?: PlatformBoxProps['padding'];

	/**
	 * The logical block start and end padding of an element.
	 *
	 * @type [Space tokens](https://atlassian.design/components/tokens/all-tokens#space)
	 */
	paddingBlock?: PlatformBoxProps['paddingBlock'];

	/**
	 * The logical block start padding of an element.
	 *
	 * @type [Space tokens](https://atlassian.design/components/tokens/all-tokens#space)
	 */
	paddingBlockStart?: PlatformBoxProps['paddingBlockStart'];

	/**
	 * The logical block end padding of an element.
	 *
	 * @type [Space tokens](https://atlassian.design/components/tokens/all-tokens#space)
	 */
	paddingBlockEnd?: PlatformBoxProps['paddingBlockEnd'];

	/**
	 * The logical inline start and end padding of an element.
	 *
	 * @type [Space tokens](https://atlassian.design/components/tokens/all-tokens#space)
	 */
	paddingInline?: PlatformBoxProps['paddingInline'];

	/**
	 * The logical inline end padding of an element.
	 *
	 * @type [Space tokens](https://atlassian.design/components/tokens/all-tokens#space)
	 */
	paddingInlineEnd?: PlatformBoxProps['paddingInlineEnd'];

	/**
	 * The logical inline start padding of an element.
	 *
	 * @type [Space tokens](https://atlassian.design/components/tokens/all-tokens#space)
	 */
	paddingInlineStart?: PlatformBoxProps['paddingInlineStart'];

	/**
	 * A token alias for background color. See: [Design tokens](https://atlassian.design/components/tokens/all-tokens)
	 * for a list of available colors.
	 *
	 * When the background color is set to a surface token, the current surface CSS variable
	 * will also be set to this value in the `Box` styles.
	 *
	 * @type [Background color tokens](https://atlassian.design/components/tokens/all-tokens#color-background)
	 */
	backgroundColor?: PlatformBoxProps['backgroundColor'];

	/**
	 * Apply a subset of permitted styles, powered by Atlassian Design System tokens.
	 * For a list of supported style properties on this component, see [here](https://developer.atlassian.com/platform/forge/ui-kit/components/xcss).
	 *
	 * @type XCSSProp
	 */
	xcss?: XCSSProp;

	/**
	 * @type string
	 */
	role?: PlatformBoxProps['role'];

	/**
	 * @type ForgeComponent
	 */
	children?: PlatformBoxProps['children'];
};

/**
 * A box is a generic container that provides managed access to design tokens.
 *
 * @see [Box](https://developer.atlassian.com/platform/forge/ui-kit/components/box/) in UI Kit documentation for more information
 */
export type TBox<T> = (props: BoxProps) => T;