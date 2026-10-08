import type { CompiledStyles } from '@compiled/react';

type TSurfaceResetDeclarations = {
	pointerEvents: 'auto';
	whiteSpace: 'normal';
	wordBreak: 'normal';
	overflowWrap: 'normal';
	textAlign: 'start';
	textIndent: '0';
	textTransform: 'none';
	color: 'var(--ds-text)';
};

/**
 * `cssMap` widens string literals to `string`, but keeps the literal type that
 * `token()` returns.
 */
type TCompiledValue<TValue> = TValue extends `var(--ds-${string})` ? TValue : string;

/**
 * The surface reset is duplicated in `popover/popover.tsx` and
 * `dialog/dialog-content.tsx` (ADS forbids shared styles). Each copy checks
 * itself against this type. Change `TSurfaceResetDeclarations` first.
 *
 * Checks property names and the selector only: `cssMap` widens nested values to
 * `string`. The host specificity VR tests check the values.
 */
export type TBoostedSurfaceReset<TSelector extends string> = CompiledStyles<{
	[TKey in TSelector]: {
		[TProperty in keyof TSurfaceResetDeclarations]: TCompiledValue<
			TSurfaceResetDeclarations[TProperty]
		>;
	};
}>;

type TIsIdentical<A, B> =
	(<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/**
 * Identity, not assignability, so extra properties or a wrong selector fail.
 */
export type TBoostedSurfaceResetCheck<TActual, TSelector extends string> =
	TIsIdentical<TActual, TBoostedSurfaceReset<TSelector>> extends true
		? true
		: 'surfaceResetStyles.root does not match TBoostedSurfaceReset in internal/surface-reset.tsx';
