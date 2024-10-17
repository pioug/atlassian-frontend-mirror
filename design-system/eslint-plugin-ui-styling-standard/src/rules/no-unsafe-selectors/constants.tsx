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

export const allowedPseudos = new Set(
	/**
	 * The `&` is included above for type checking reasons,
	 * but we don't actually want it when consuming the values.
	 */
	cssPseudos.map((pseudo) => pseudo.slice(1)),
);

export const legacyPseudoElements = new Set([':after', ':before', ':first-letter', ':first-line']);

export const ignoredAtRules = new Set([
	'@container', // ignored because it's covered by `no-container-queries`
	'@media', // ignored because it's covered by `no-nested-styles`
	'@supports',
	'@property',
]);
