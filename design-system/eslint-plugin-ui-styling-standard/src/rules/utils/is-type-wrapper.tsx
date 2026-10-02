/**
 * TypeScript-only wrappers around an expression that ESTree does not model. None of them change
 * the runtime value, so a rule reading a style key, value or argument should look through them:
 *
 * - `['.foo' satisfies `.${typeof FOO_CLASS}`]: {…}`
 * - `color: 'red !important' as const`
 * - `css({…} as const)`
 * - `<T>{…}` and `value!`
 */
const TYPE_WRAPPER_TYPES: ReadonlySet<string> = new Set([
	'TSAsExpression',
	'TSNonNullExpression',
	'TSSatisfiesExpression',
	'TSTypeAssertion',
]);

/**
 * Whether `node` is a TypeScript wrapper (`as`, `satisfies`, `<T>`, `!`) around an expression.
 */
export function isTypeWrapper(node: { type: string } | null | undefined): boolean {
	return Boolean(node && TYPE_WRAPPER_TYPES.has(node.type));
}
