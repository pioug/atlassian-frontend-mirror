/**
 * A rendered element produced by a Forge UI Kit component function.
 * This is the return type of all UI Kit component constructors.
 */
export type ForgeElement<P = Record<string, any>> = PrimitiveElement<P> | FunctionElement<P>;

/**
 * A Forge element backed by a primitive (string-typed) component.
 */
export interface PrimitiveElement<P = Record<string, any>> {
	key: any;
	props: P & { children: ForgeNode[] };
	type: string;
}

/**
 * A Forge element backed by a function component.
 */
export interface FunctionElement<P = Record<string, any>> {
	key: any;
	props: P & { children: ForgeNode[] };
	type: (props: P) => ForgeElement;
}

/**
 * Any value that can appear as a child in the Forge UI Kit component tree:
 * a `ForgeElement`, `null`, `boolean`, or `undefined`.
 */
export type ForgeNode = ForgeElement | null | boolean | undefined;

/**
 * The accepted shape for the `children` prop in Forge UI Kit components.
 *
 * A single value of type `T`, or an array (possibly nested) of `T` values.
 * Defaults to `ForgeNode`.
 */
export type ForgeChildren<T = ForgeNode> = T | (T | T[])[];
