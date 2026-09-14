/**
 * Canonical at-rule keys for use with `@atlaskit/css`.
 *
 * These types intentionally include the at-rule prefix so they can be used
 * directly as style-object keys:
 *
 * ```tsx
 * css({
 *   ['@media (min-width: 48rem)' satisfies MediaAboveSm]: {
 *     display: 'grid',
 *   },
 * });
 * ```
 *
 * TODO: ALL MEDIA QUERIES not failing this should fail a new ESLint rule perhaps.
 */

// ---------------------------------------------------------------------------
// Responsive breakpoints
// ---------------------------------------------------------------------------

export type MediaAboveXxs = '@media all';
export type MediaAboveXs = '@media (min-width: 30rem)';
export type MediaAboveSm = '@media (min-width: 48rem)';
export type MediaAboveMd = '@media (min-width: 64rem)';
export type MediaAboveLg = '@media (min-width: 90rem)';
export type MediaAboveXl = '@media (min-width: 110.5rem)';

export type MediaBelowXs = '@media not all and (min-width: 30rem)';
export type MediaBelowSm = '@media not all and (min-width: 48rem)';
export type MediaBelowMd = '@media not all and (min-width: 64rem)';
export type MediaBelowLg = '@media not all and (min-width: 90rem)';
export type MediaBelowXl = '@media not all and (min-width: 110.5rem)';

export type MediaOnlyXxs = '@media (min-width: 0rem) and (max-width: 29.99rem)';
export type MediaOnlyXs = '@media (min-width: 30rem) and (max-width: 47.99rem)';
export type MediaOnlySm = '@media (min-width: 48rem) and (max-width: 63.99rem)';
export type MediaOnlyMd = '@media (min-width: 64rem) and (max-width: 89.99rem)';
export type MediaOnlyLg = '@media (min-width: 90rem) and (max-width: 110.49rem)';
export type MediaOnlyXl = '@media (min-width: 110.5rem)';

export type MediaBreakpointQuery =
	| MediaAboveXxs
	| MediaAboveXs
	| MediaAboveSm
	| MediaAboveMd
	| MediaAboveLg
	| MediaAboveXl
	| MediaBelowXs
	| MediaBelowSm
	| MediaBelowMd
	| MediaBelowLg
	| MediaBelowXl
	| MediaOnlyXxs
	| MediaOnlyXs
	| MediaOnlySm
	| MediaOnlyMd
	| MediaOnlyLg
	| MediaOnlyXl;

// ---------------------------------------------------------------------------
// User-preference and environment media queries
// ---------------------------------------------------------------------------

export type MediaDarkMode = '@media (prefers-color-scheme: dark)';
export type MediaLightMode = '@media (prefers-color-scheme: light)';

export type MediaReducedMotion = '@media (prefers-reduced-motion: reduce)';
export type MediaReducedTransparency = '@media (prefers-reduced-transparency: reduce)';

export type MediaForcedColorsActive = '@media screen and (forced-colors: active)';
export type MediaLegacyHighContrast = '@media screen and (-ms-high-contrast: active)';
export type MediaForcedColorsOrLegacyHighContrast =
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)';

/**
 * The finite set of media queries that the design system currently treats as
 * canonical. Do not add a generic media at-rule here: doing so would make the
 * strict API accept arbitrary media-query strings.
 */
export type AllowedMediaQuery =
	| MediaBreakpointQuery
	| MediaDarkMode
	| MediaLightMode
	| MediaReducedMotion
	| MediaReducedTransparency
	| MediaForcedColorsActive
	| MediaLegacyHighContrast
	| MediaForcedColorsOrLegacyHighContrast;

type WithoutMediaPrefix<T> = T extends `@media ${infer Condition}` ? Condition : never;

export type MediaQueryCondition = WithoutMediaPrefix<AllowedMediaQuery>;

// ---------------------------------------------------------------------------
// Container queries
// ---------------------------------------------------------------------------

type ContainerCSSLengthUnit = 'px' | 'rem' | 'em' | 'ch' | 'vw' | 'vh';
type ContainerCSSLength = `${number}${ContainerCSSLengthUnit}`;
type ContainerDimension = 'width' | 'height' | 'inline-size' | 'block-size';
type ContainerRangeDimension = `min-${ContainerDimension}` | `max-${ContainerDimension}`;
type ContainerComparison = '<' | '<=' | '>' | '>=';

/**
 * Narrow, type-checked size-query forms for the most common container-query
 * use cases. The `${string}` portion represents a required container name.
 *
 * @example `@container sidebar (width > 300px)`
 */
export type ContainerAtRule =
	| `@container ${string} (${ContainerDimension} ${ContainerComparison} ${ContainerCSSLength})`
	| `@container ${string} (${ContainerCSSLength} ${ContainerComparison} ${ContainerDimension})`
	| `@container ${string} (${ContainerRangeDimension}: ${ContainerCSSLength})`;

// ---------------------------------------------------------------------------
// Other at-rules
// ---------------------------------------------------------------------------

export type SupportsAtRule = `@supports ${string}`;
export type PropertyAtRule = `@property --${string}`;
export type LayerAtRule = `@layer ${string}`;
export type ScopeAtRule = `@scope ${string}`;
export type KeyframesAtRule = `@keyframes ${string}`;
export type StartingStyleAtRule = '@starting-style';
export type ViewTransitionAtRule = '@view-transition';

export type AllowedAtRules =
	| AllowedMediaQuery
	| ContainerAtRule
	| SupportsAtRule
	| PropertyAtRule
	| LayerAtRule
	| ScopeAtRule
	| KeyframesAtRule
	| StartingStyleAtRule
	| ViewTransitionAtRule;
