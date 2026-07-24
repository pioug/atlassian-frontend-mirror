// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css as cssEmotion } from '@emotion/react';
import type {
	CSSInterpolation,
	CSSObject,
	CSSPropertiesWithMultiValues,
	SerializedStyles,
} from '@emotion/serialize';
import type * as CSS from 'csstype';

import type { MediaQuery } from '../responsive/types';

import type { TokenisedProps } from './tokenised-props';
import { tokensMap } from './tokens-map';
import { uniqueSymbol } from './unique-symbol';

type StyleMapKey = keyof typeof tokensMap;
type TokensMapKey = keyof (typeof tokensMap)[StyleMapKey];

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
 *
 * @deprecated Use `@atlaskit/css` with `@atlaskit/primitives/compiled` instead.
 * {@link https://hello.atlassian.net/wiki/spaces/DST/pages/4992259434/Guidance+Migrating+to+atlaskit+css+from+xcss Internal documentation for migration; no external access}
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function xcss(style: SafeCSSObject): {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	readonly [uniqueSymbol]: SerializedStyles;
} {
	return baseXcss(style);
}
