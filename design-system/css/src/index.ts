import {
  createStrictAPI,
  type CSSPseudos,
  type StrictCSSProperties,
  type XCSSAllProperties,
  type XCSSAllPseudos,
} from '@compiled/react';

import { type DesignTokenStyles } from '@atlaskit/tokens/css-type-schema';

type MediaQuery =
  | '(min-width: 30rem)'
  | '(min-width: 48rem)'
  | '(min-width: 64rem)'
  | '(min-width: 90rem)'
  | '(min-width: 110rem)';

const { XCSSProp, css, cssMap, cx } = createStrictAPI<
  DesignTokenStyles,
  { media: MediaQuery }
>();

export { css, cssMap, cx, XCSSAllProperties, XCSSAllPseudos };

// This is to mitigate local TS error TS2315: Type 'StrictXCSSProp' is not generic.
// Currently for some reason tsc is generating malformed .d.ts in local dev environment, below change fixes it
type LocalXCSSProp<
  TAllowedProperties extends keyof StrictCSSProperties,
  TAllowedPseudos extends CSSPseudos,
  TRequiredProperties extends {
    requiredProperties: TAllowedProperties;
    requiredPseudos: TAllowedPseudos;
  } = never,
> = ReturnType<
  typeof XCSSProp<TAllowedProperties, TAllowedPseudos, TRequiredProperties>
>;

/**
 * ## StrictXCSSProp
 *
 * Declare styles your component takes with all other styles marked as violations
 * by the TypeScript compiler. There are two primary use cases for xcss prop:
 *
 * - safe style overrides
 * - inverting style declarations
 *
 * Interverting style declarations is interesting for platform teams as
 * it means products only pay for styles they use as they're now the ones who declare
 * the styles!
 *
 * The {@link StrictXCSSProp} type has generics two of which must be defined — use to explicitly
 * set what you want to maintain as API. Use {@link XCSSAllProperties} and {@link XCSSAllPseudos}
 * to enable all properties and pseudos.
 *
 * The third generic is used to declare what properties and pseudos should be required.
 *
 * ```tsx
 * interface MyComponentProps {
 *   // Color is accepted, all other properties / pseudos are considered violations.
 *   xcss?: StrictXCSSProp<'color', never>;
 *
 *   // Only background color and hover pseudo are accepted.
 *   xcss?: StrictXCSSProp<'backgroundColor', '&:hover'>;
 *
 *   // All properties are accepted, all pseudos are considered violations.
 *   xcss?: StrictXCSSProp<XCSSAllProperties, never>;
 *
 *   // All properties are accepted, only the hover pseudo is accepted.
 *   xcss?: StrictXCSSProp<XCSSAllProperties, '&:hover'>;
 *
 *   // The xcss prop is required as well as the color property. No pseudos are required.
 *   xcss: StrictXCSSProp<
 *     XCSSAllProperties,
 *     '&:hover',
 *     { requiredProperties: 'color', requiredPseudos: never }
 *   >;
 * }
 *
 * function MyComponent({ xcss }: MyComponentProps) {
 *   return <div css={{ color: 'var(--ds-text-danger)' }} className={xcss} />
 * }
 * ```
 *
 * The xcss prop works with static inline objects and the [cssMap](https://compiledcssinjs.com/docs/api-cssmap) API.
 *
 * ```jsx
 * // Declared as an inline object
 * <Component xcss={{ color: 'var(--ds-text)' }} />
 *
 * // Declared with the cssMap API
 * const styles = cssMap({ text: { color: 'var(--ds-text)' } });
 * <Component xcss={styles.text} />
 * ```
 *
 * To concatenate and conditonally apply styles use the {@link cssMap} and {@link cx} functions.
 */
export type StrictXCSSProp<
  TAllowedProperties extends keyof StrictCSSProperties,
  TAllowedPseudos extends CSSPseudos,
  TRequiredProperties extends {
    requiredProperties: TAllowedProperties;
    requiredPseudos: TAllowedPseudos;
  } = never,
> = LocalXCSSProp<TAllowedProperties, TAllowedPseudos, TRequiredProperties>;
