import type {
	BlockControlUIContext,
	BlockControlUIContextActiveNode,
} from '@atlaskit/editor-common/block-controls/block-control-ui-context';

/**
 * Resolves to `T` only when `Compared` lists every key of `T`. Adding a field to the context types
 * turns the comparators' parameters into `never`, so callers stop compiling until the comparison
 * handles the new field.
 */
type ComparedFields<T, Compared extends keyof T> =
	Exclude<keyof T, Compared> extends never ? T : never;

type ComparedNodeContext = ComparedFields<
	BlockControlUIContextActiveNode,
	'ancestors' | 'depth' | 'node' | 'parentType' | 'pos' | 'rootPos' | 'rootType' | 'type'
>;

/**
 * `controlVisibility` is derived from component predicates after the context is created, never by
 * `createBlockControlsSurfaceContextForPosition`, so it is not compared.
 */
type ComparedContext = ComparedFields<
	Omit<BlockControlUIContext, 'controlVisibility'>,
	'activeControlKey' | 'activeNode' | 'rootNode' | 'targetNode'
>;

/**
 * ProseMirror preserves immutable node objects for unchanged content, so node identity detects
 * content changes without a deep comparison. Position and ancestry must also match: an unchanged
 * node can move or gain a different parent, which changes the context supplied to its controls.
 * The ancestor comparison is O(depth); it never walks document children or reads DOM geometry.
 */
const areNodeContextsEqual = (
	a: ComparedNodeContext | undefined,
	b: ComparedNodeContext | undefined,
): boolean =>
	a === b ||
	Boolean(
		a &&
		b &&
		a.node === b.node &&
		a.pos === b.pos &&
		a.depth === b.depth &&
		a.parentType === b.parentType &&
		a.type.name === b.type.name &&
		a.rootPos === b.rootPos &&
		a.rootType?.name === b.rootType?.name &&
		a.ancestors.length === b.ancestors.length &&
		a.ancestors.every((ancestor, index) => {
			const other = b.ancestors[index];
			return (
				ancestor.pos === other.pos &&
				ancestor.depth === other.depth &&
				ancestor.type.name === other.type.name
			);
		}),
	);

/**
 * Compares contexts produced by `createBlockControlsSurfaceContextForPosition`. Includes root and
 * active-node context because controls can depend on more than the target itself, for example a
 * changed containing block or a different active control.
 */
export const areBlockControlsSurfaceContextsEqual = (
	a: ComparedContext,
	b: ComparedContext,
): boolean =>
	a.activeControlKey === b.activeControlKey &&
	areNodeContextsEqual(a.targetNode, b.targetNode) &&
	areNodeContextsEqual(a.rootNode, b.rootNode) &&
	areNodeContextsEqual(a.activeNode, b.activeNode);
