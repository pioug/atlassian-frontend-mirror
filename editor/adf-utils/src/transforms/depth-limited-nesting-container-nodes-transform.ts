import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { traverse } from '../traverse/traverse';
import type { ADFEntity } from '../types';
import { panelC1FallbackTransform } from './panel-c1-fallback-transform';
import { panelC1FallbackTransformV2 } from './panel-c1-fallback-transform-v2';

export type ContainerNodesTransformOptions = {
	/**
	 * Node type names of the ancestors of the position the document is destined for,
	 * ordered outermost (document root) to innermost.
	 *
	 * Supply this when `adf` is a fragment that has been lifted out of its surrounding
	 * document — for example a single node streamed back by an AI tool call and rewrapped
	 * in a synthetic top node. Without it the transform can only see the synthetic parent
	 * and will wrongly assume the fragment is destined for the document root.
	 */
	parentNodes?: readonly string[];
};

/**
 * Returns the set of parent node names whose content expression in the
 * supplied schema allows a `panel_c1` child. Returns an empty set if the
 * schema does not declare a `panel_c1` node.
 */
const getPanelC1AllowedParentTypes = (schema: Schema): Set<string> => {
	const panelC1Type = schema.nodes['panel_c1'];
	if (!panelC1Type) {
		return new Set();
	}

	const allowed = new Set<string>();
	for (const nodeType of Object.values(schema.nodes)) {
		if (nodeType.contentMatch?.matchType(panelC1Type)) {
			allowed.add(nodeType.name);
		}
	}
	return allowed;
};

/**
 * Resolves which ancestor will actually become the parent of the top-level nodes of `adf`
 * once the fragment is placed back into its destination document.
 *
 * Walks `parentNodes` innermost-first and returns the first type whose content expression
 * accepts a `panel`. Ancestors closer in than that (a textblock the selection happens to sit
 * in, for instance) cannot hold a panel, so they cannot be the effective parent. Returns
 * `undefined` when no destination context was supplied or none of the ancestors can hold a
 * panel, in which case callers fall back to the parent seen during traversal.
 */
const resolveEffectiveRootParentType = (
	schema: Schema,
	parentNodes: readonly string[] | undefined,
): string | undefined => {
	const panelType = schema.nodes['panel'];
	if (!panelType || !parentNodes?.length) {
		return undefined;
	}

	for (let index = parentNodes.length - 1; index >= 0; index--) {
		const parentType = parentNodes[index];
		if (schema.nodes[parentType]?.contentMatch?.matchType(panelType)) {
			return parentType;
		}
	}

	return undefined;
};

/**
 * Upgrades container nodes to their table-allowing variant wherever the schema allows it,
 * regardless of the node's content. Currently: `panel` -> `panel_c1` (document root / layout
 * column / synced block). Schema-driven and flag-free — a no-op when the schema does not declare
 * the variant.
 *
 * When `options.parentNodes` is supplied, top-level nodes of `adf` are judged against their
 * destination parent rather than against the synthetic top node they are currently wrapped in.
 * This keeps a `panel` bound for a container that allows `panel` but not `panel_c1` (a table
 * cell, say) as a plain `panel`.
 */
export const upgradeContainerNodes = (
	adf: ADFEntity,
	schema: Schema,
	options?: ContainerNodesTransformOptions,
): {
	isTransformed: boolean;
	transformedAdf: ADFEntity | false;
} => {
	const panelC1AllowedParents = getPanelC1AllowedParentTypes(schema);
	if (panelC1AllowedParents.size === 0) {
		return { isTransformed: false, transformedAdf: adf };
	}

	const topNodeType = schema.topNodeType.name;
	const effectiveRootParentType = resolveEffectiveRootParentType(schema, options?.parentNodes);

	let isTransformed = false;
	const transformedAdf = traverse(adf, {
		panel: (node, parent, _index, depth) => {
			// A panel sitting directly under the top node is destined for whatever the
			// fragment gets inserted into, not for the top node itself.
			const isTopLevelNode = depth === 1 && parent.node?.type === topNodeType;
			const parentType =
				isTopLevelNode && effectiveRootParentType ? effectiveRootParentType : parent.node?.type;

			if (parentType && panelC1AllowedParents.has(parentType)) {
				isTransformed = true;
				return { ...node, type: 'panel_c1' };
			}
			return;
		},
	});

	return { isTransformed, transformedAdf };
};

/**
 * Applies schema-driven panel container transforms:
 * - downgrades/restores `panel_c1` content via the fallback transform when gated on
 * - promotes `panel` nodes to `panel_c1` wherever the schema allows it
 *
 * Pass `options.parentNodes` when `adf` is a fragment lifted out of a larger document so the
 * promotion is judged against the fragment's destination parent.
 */
export const transformContainerNodes = (
	adf: ADFEntity,
	schema: Schema,
	options?: ContainerNodesTransformOptions,
): {
	isTransformed: boolean;
	transformedAdf: ADFEntity | false;
	transformedNodeTypes: string[];
} => {
	let isTransformed: boolean = false;
	const transformedNodeTypes = new Set<string>();
	let transformedAdf: ADFEntity = adf;

	// Gate the generalised (table + expand + panel + blockquote + bodiedExtension) transform
	// behind the consolidated container-in-panel experiment; the in-production table-in-panel
	// path continues to use the deprecated table-only transform.
	const panelC1FallbackResult = isExperimentEnabled('platform_editor_nest_container_in_panel')
		? panelC1FallbackTransformV2(schema, transformedAdf)
		: panelC1FallbackTransform(schema, transformedAdf);
	if (panelC1FallbackResult.isTransformed && panelC1FallbackResult.transformedAdf) {
		isTransformed = true;
		transformedNodeTypes.add('panel_c1');
		transformedAdf = panelC1FallbackResult.transformedAdf;
	}

	const promotionResult = upgradeContainerNodes(transformedAdf, schema, options);
	if (promotionResult.isTransformed) {
		isTransformed = true;
		transformedNodeTypes.add('panel_c1');
	}

	return {
		transformedAdf: promotionResult.transformedAdf,
		isTransformed,
		transformedNodeTypes: Array.from(transformedNodeTypes),
	};
};
