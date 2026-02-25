import type { CSSPseudos } from '@compiled/react';

/**
 * Validation approach from
 * https://stackoverflow.com/a/71236280
 */
type Validate<T extends true> = T;
type HasAllUnique<Tuple, Union, Seen = never> = Tuple extends readonly [infer Head, ...infer Tail]
	? Head extends Seen
		? {
				ERROR: ['The following key appears more than once in the tuple:', Head];
			}
		: HasAllUnique<Tail, Exclude<Union, Head>, Head | Seen>
	: [Union] extends [never]
		? true
		: { ERROR: ['Some keys are missing from the tuple:', Union] };

/**
 * Exporting this so it isn't considered unused.
 */
export type _ = Validate<HasAllUnique<typeof cssPseudos, CSSPseudos>>;

const cssPseudos = [
	'&:active',
	'&:autofill',
	'&:blank',
	'&:checked',
	'&:default',
	'&:defined',
	'&:disabled',
	'&:empty',
	'&:enabled',
	'&:first',
	'&:focus',
	'&:focus-visible',
	'&:focus-within',
	'&:fullscreen',
	'&:hover',
	'&:in-range',
	'&:indeterminate',
	'&:invalid',
	'&:left',
	'&:link',
	'&:local-link',
	'&:optional',
	'&:out-of-range',
	'&:paused',
	'&:picture-in-picture',
	'&:placeholder-shown',
	'&:playing',
	'&:read-only',
	'&:read-write',
	'&:required',
	'&:right',
	'&:target',
	'&:user-invalid',
	'&:user-valid',
	'&:valid',
	'&:visited',
	'&::after',
	'&::backdrop',
	'&::before',
	'&::cue',
	'&::cue-region',
	'&::first-letter',
	'&::first-line',
	'&::grammar-error',
	'&::marker',
	'&::placeholder',
	'&::selection',
	'&::spelling-error',
	'&::target-text',
	'&::view-transition',
	'&::-webkit-details-marker',
] as const;

export const allowedPseudos: Set<string> = new Set(
	/**
	 * The `&` is included above for type checking reasons,
	 * but we don't actually want it when consuming the values.
	 */
	cssPseudos.map((pseudo) => pseudo.slice(1)),
);

export const legacyPseudoElements: Set<string> = new Set([
	':after',
	':before',
	':first-letter',
	':first-line',
]);

export const ignoredAtRules: Set<string> = new Set([
	'@container', // ignored because it's covered by `no-container-queries`
	'@media', // ignored because it's covered by `no-nested-styles`
	'@supports',
	'@property',
	'@starting-style',
]);

/**
 * At-rules that are allowed to be used in "grouped" form within cssMap.
 *
 * "Grouped" refers to the legacy Compiled syntax where an at-rule key with no parameters
 * (matching `/^@[A-z-]+$/`) contains nested variant keys, like:
 *
 * ```typescript
 * // ❌ GROUPED (not allowed for @media):
 * cssMap({
 *   variant: {
 *     '@media': {                    // at-rule key with no parameters
 *       '(min-width: 900px)': {},    // nested variants
 *       '(min-width: 1200px)': {},
 *     }
 *   }
 * })
 *
 * // ✅ FLAT (preferred for @media):
 * cssMap({
 *   variant: {
 *     '@media (min-width: 900px)': {},   // at-rule with parameters
 *     '@media (min-width: 1200px)': {},
 *   }
 * })
 * ```
 *
 * However, some at-rules like `@starting-style` have no parameters and can only be
 * written in the "grouped" form at the variant level:
 *
 * ```typescript
 * // ✅ ALLOWED (only valid syntax for @starting-style):
 * cssMap({
 *   fade: {
 *     '@starting-style': {    // at-rule with no parameters
 *       opacity: 0,           // styles to apply
 *     }
 *   }
 * })
 * ```
 *
 * Note: This only applies to at-rules at the variant level. Nested at-rules inside
 * other rulesets (e.g., `@starting-style` inside `@media (...)`) are handled by
 * `walkStyleRuleset` and are not considered "grouped".
 */
export const allowedGroupedAtRules: Set<string> = new Set([
	'@starting-style', // Has no parameters, can only be written in grouped form
]);
