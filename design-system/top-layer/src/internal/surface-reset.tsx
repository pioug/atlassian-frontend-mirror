import type { CompiledStyles } from '@compiled/react';

/**
 * The host surface reset is declared twice, in `popover/popover.tsx` and
 * `dialog/dialog-content.tsx`, because ADS forbids sharing styles across files
 * (`no-exported-styles` / `no-imported-style-values` — Compiled styles are null
 * at runtime). Each copy asserts itself against this type with
 * `TSurfaceResetCheck`, so the compiler fails if either drifts. Change this
 * first, then both copies.
 */
export type TSurfaceReset = CompiledStyles<{
	pointerEvents: 'auto';
	whiteSpace: 'normal';
	wordBreak: 'normal';
	overflowWrap: 'normal';
	textAlign: 'start';
	textIndent: '0';
	textTransform: 'none';
}>;

type TIsIdentical<A, B> =
	(<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/**
 * Use as `true satisfies TSurfaceResetCheck<typeof surfaceResetStyles.root>`.
 * Identity rather than assignability, so extra or widened properties also fail.
 */
export type TSurfaceResetCheck<TActual> =
	TIsIdentical<TActual, TSurfaceReset> extends true
		? true
		: 'surfaceResetStyles does not match TSurfaceReset in internal/surface-reset.tsx';
