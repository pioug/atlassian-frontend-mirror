/**
 * Compile-time type assertions used in place of Vitest's `expectTypeOf`.
 *
 * When an assertion does not hold, the call requires an argument of type `never`, so the
 * zero-argument call fails type checking (`afm ts check`). At runtime each helper records one
 * trivial Jest assertion so type-only tests satisfy the platform's `expect.hasAssertions()` setup.
 */

/** Strict type equality, distinguishing `any`, `readonly`, and optional members. */
type IsEqual<A, B> =
	(<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/** Assert that `Actual` and `Expected` are the same type. */
export function assertTypeEqual<Actual, Expected>(
	...proof: IsEqual<Actual, Expected> extends true ? [] : [never]
): void {
	expect(proof).toHaveLength(0);
}

/** Assert that `Actual` is assignable to `Expected`. */
export function assertTypeAssignable<Actual, Expected>(
	...proof: [Actual] extends [Expected] ? [] : [never]
): void {
	expect(proof).toHaveLength(0);
}
