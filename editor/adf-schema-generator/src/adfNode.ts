import type { ADFMark } from './adfMark';
import type { TransformerNames } from './transforms/transformerNames';
import type { ADFMarkSpec } from './types/ADFMarkSpec';
import type { ADFNodeGroup } from './types/ADFNodeGroup';
import type {
	ADFNodeContentOneOrMoreSpec,
	ADFNodeContentOrSpec,
	ADFNodeContentZeroOrMoreSpec,
	ADFNodeContentSpec,
	ADFNodeSpec,
} from './types/ADFNodeSpec';

export class ADFNode<
	TVariantsNames extends Array<unknown> = [],
	TNodeSpecType extends ADFNodeSpec = ADFNodeSpec,
> {
	#base: ADFNode<TVariantsNames, TNodeSpecType> | null = null;
	#spec: TNodeSpecType | null = null;
	#variant: string | null = null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#variants: Map<ToLiteralUnion<TVariantsNames>, ADFNode<any, TNodeSpecType>> = new Map();

	#type: string;
	#groups: Array<string>;

	constructor(type: string) {
		this.#type = type;
		this.#groups = [];
	}

	/**
	 * Returns true if the node has been defined, e.g. node.define() method was called.
	 */
	isDefined(): boolean {
		return !!this.#spec;
	}

	/**
	 * Returns true if the node is a root node.
	 * Which marks the top level of the DSL schema tree.
	 */
	isRoot(): boolean {
		// @ts-expect-error
		return this.#spec.root;
	}

	/**
	 * Checks whether the node is ignored by a given transformer.
	 */
	isIgnored(transformerName: TransformerNames): boolean | undefined {
		if (!this.#spec) {
			throw new Error('Node is not defined');
		}
		return this.#spec.ignore?.includes(transformerName);
	}

	/**
	 * If true, the node doesn't allow marks to be set.
	 * This is stricter than simply having an empty marks list.
	 */
	hasNoMarks(): boolean | undefined {
		// @ts-expect-error
		return this.#spec.noMarks;
	}

	/**
	 * Define a node.
	 *
	 * Assigns NodeSpec to the node. If node was not defined and can't be part of the schema tree.
	 */
	define<T extends TNodeSpecType>(spec: T): ADFNode<TVariantsNames, TNodeSpecType> {
		if (this.#spec) {
			throw new Error('Cannot re-define a node');
		}

		this.#spec = spec;

		if (spec.noMarks && spec.marks?.length) {
			throw new Error('Node with noMarks true has marks');
		}

		return this;
	}

	/**
	 * Allow an additional node (or node group) to appear in this node's content.
	 *
	 * This exists so node files can be authored in isolation and any cross-node `content`
	 * references that would otherwise form a module import cycle (e.g. `panel` ↔ `table`) can
	 * be wired up downstream, once every node module has finished evaluating. That removes the
	 * "referenced node is `undefined` during traversal" crash class entirely — by construction.
	 *
	 * Behavior:
	 * - Appends `child` to the last `$or(...)` group of this node's content.
	 * - If the node has no content yet, seeds it with `[$one+($or(child))]`.
	 * - If the node's existing content does not end with a `$one+($or(...))` (or `$zero+($or(...))`)
	 *   expression, throws — the caller should set up base content via `define()` first.
	 *
	 * Must be called after `define()`.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addContent(child: ADFNode<any> | ADFNodeGroup): this {
		if (!this.#spec) {
			throw new Error('Cannot addContent before define()');
		}

		// Case 1 — the node has no content yet. Seed it with `[$one+($or(child))]`.
		if (!this.#spec.content || this.#spec.content.length === 0) {
			const content: ADFNodeContentSpec[] = [
				{ type: '$one+', content: { type: '$or', content: [child] } },
			];
			this.#spec = { ...this.#spec, content };
			return this;
		}

		// Case 2 — append `child` into the existing trailing `$one+($or(...))` / `$zero+($or(...))`.
		const existingLast = this.#spec.content[this.#spec.content.length - 1];
		const isQuantifier = existingLast?.type === '$one+' || existingLast?.type === '$zero+';
		const existingOrGroup = isQuantifier && !Array.isArray(existingLast.content)
			? existingLast.content
			: undefined;
		const isOrGroup = existingOrGroup?.type === '$or' && Array.isArray(existingOrGroup.content);

		if (!isQuantifier || !isOrGroup || !existingOrGroup) {
			throw new Error(
				`addContent expects existing content to end with a $one+($or(...)) or $zero+($or(...)) expression. Node type: ${this.#type}`,
			);
		}

		// No-op if the child is already present — prevents duplicate schema entries.
		if ((existingOrGroup.content as Array<unknown>).includes(child)) {
			return this;
		}

		// Only the plain-object wrappers along the mutation path ($one+/$zero+ and $or) need
		// cloning — not the ADFNode references inside $or.content, whose state lives entirely
		// in private class fields that spread/lodash cannot introspect. Shallow-cloning just
		// the wrappers is therefore both correct and safe for variant isolation.
		const clonedOrGroup: ADFNodeContentOrSpec = {
			...(existingOrGroup as ADFNodeContentOrSpec),
			content: [...(existingOrGroup as ADFNodeContentOrSpec).content, child],
		};
		const clonedQuantifier = {
			...existingLast,
			content: clonedOrGroup,
		} as ADFNodeContentOneOrMoreSpec | ADFNodeContentZeroOrMoreSpec;
		const content = [
			...this.#spec.content.slice(0, -1),
			clonedQuantifier,
		];

		this.#spec = { ...this.#spec, content };
		return this;
	}

	/**
	 * Define a variant of the node.
	 *
	 * There is quite often a need to define a slightly different version of the node. E.g.:
	 * - A feature flag to enable/disable a feature
	 * - Stricter validation for a specific use case, like allowing certain marks on a top level node,
	 *   and not allowing them on a nested variant of the same node.
	 *
	 * Variant allows for this use case.
	 *
	 * Each variant shallowly overrides the base node spec. And then can be used via node.use('variant_name') method.
	 */
	variant<Name extends string, T extends ADFNodeSpec>(
		name: Name,
		spec: T,
	): ADFNode<[...TVariantsNames, Name], TNodeSpecType & T> {
		if (!this.#spec) {
			throw new Error('Cannot define a variant if base was not defined');
		}

		if (this.#variant) {
			throw new Error('Cannot create a variant of a variant');
		}

		// any – #variants are strictly typed and typescript is not happy about generic string
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (this.#variants.has(name as any)) {
			throw new Error(`Variant "${name}" already exists`);
		}

		// This properties must not be inherited from the base node by the variant
		// as they can cause unexpected behavior.
		//
		// The purpose of this is to force people to manually clone these if needed.
		const NOT_INHERITED_PROPERTIES = [
			'DANGEROUS_MANUAL_OVERRIDE',
			'hasEmptyMarks',
			'stage0',
			'noExtend',
		];
		const baseSpec = { ...this.#spec };
		for (const prop of NOT_INHERITED_PROPERTIES) {
			if (prop in baseSpec) {
				// @ts-expect-error
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete baseSpec[prop];
			}
		}

		const newSpec = { ...baseSpec, ...spec };

		const newAdfNode = new ADFNode(this.#type).define(newSpec).setBase(this).setVariant(name);

		// any – #variants are strictly typed and typescript is not happy about generic string
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.#variants.set(name as any, newAdfNode);

		// any – since we are adding a new variant, the type of the base variant needs to be extended
		// with the new variant name, hence this doesn't match the return type,
		// type casting to any to make TS happy
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this as any;
	}

	/**
	 * Private method to set the base node. Used in variant creation so there is a link between the base and the variant.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setBase(base: ADFNode<any, any>) {
		this.#base = base;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this as any;
	}

	/**
	 * For a variant node, returns the base node from which the variant was created.
	 */
	getBase(): ADFNode<TVariantsNames, TNodeSpecType> | null {
		return this.#base;
	}

	getType(): string {
		return this.#type;
	}

	/**
	 * A full name of the node which includes node type and variant name.
	 */
	getName(stage0: boolean = false): string {
		const stage0Suffix = stage0 && this.hasStage0() ? '_stage0' : '';
		if (this.#variant) {
			return `${this.#type}_${this.#variant}${stage0Suffix}`;
		}
		return `${this.#type}${stage0Suffix}`;
	}

	getSpec(stage0: boolean = false): TNodeSpecType {
		if (stage0 && this.hasStage0()) {
			return {
				...this.#spec,
				...(this.#spec?.stage0 === true ? {} : this.#spec?.stage0),
			} as TNodeSpecType;
		}

		return this.#spec as TNodeSpecType;
	}

	/**
	 * Return true if the node has a stage0 spec.
	 * It's true for both cases:
	 * - full node stage 0
	 * - partial stage 0 override for a node
	 */
	hasStage0(): boolean {
		return !!this.#spec?.stage0;
	}

	/**
	 * Return true if the node is stage0 only.
	 */
	isStage0Only(): boolean {
		return this.#spec?.stage0 === true;
	}

	getMarks(stage0: boolean = false): ADFMark<ADFMarkSpec>[] {
		return this.getSpec(stage0)?.marks ?? [];
	}

	getMarksTypes(stage0: boolean = false): string[] {
		return this.getMarks(stage0).map((mark) => mark.getType());
	}

	/**
	 * Returns the name of the variant.
	 */
	getVariant(): string {
		return this.#variant || 'base';
	}

	/**
	 * Returns all variants of the node.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getVariants(): Map<ToLiteralUnion<TVariantsNames>, ADFNode<any, TNodeSpecType>> {
		return this.#variants;
	}

	/**
	 * Returns true if variant has attributes that don't match base spec.
	 */
	hasAttributeOverride(): boolean {
		if (this.getVariant() === 'base') {
			return false;
		}
		// @ts-expect-error
		return this.#spec.attrs !== this.#base.getSpec().attrs;
	}

	/**
	 * Private method to set the variant name. Used when creating a variant.
	 */
	setVariant(variant: string): this {
		this.#variant = variant;
		return this;
	}

	use(variantName: ToLiteralUnion<TVariantsNames>) {
		if (!this.#variants.has(variantName)) {
			throw new Error(`Variant "${variantName}" does not exist`);
		}
		// cast to ADFNode as we know it exists due to the has() check above and we always set an ADFNode in the map
		return this.#variants.get(variantName) as ADFNode;
	}

	setGroup(group: string): this {
		if (!this.#groups.includes(group)) {
			this.#groups.push(group);
		}
		return this;
	}

	getGroups(): string[] {
		return this.#groups;
	}
}

export function adfNode<Variant extends string, NodeSpecType extends ADFNodeSpec>(
	type: string,
): ADFNode<[Variant], NodeSpecType> {
	return new ADFNode(type);
}

// Filter out string type from allowed keys
// Before:
// type T = string | 'hello' | 'world';
// After:
// type T = 'hello' | 'world';
type ToLiteralUnion<T extends Array<unknown>> = {
	[K in keyof T]: string extends T[K] ? never : T[K];
}[number];
