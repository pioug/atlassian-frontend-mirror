import type {
	BlockControlUIContext,
	BlockControlUIContextAncestor,
	BlockControlUIContextNode,
} from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ActiveNode } from '../blockControlsPluginType';

export const getBlockControlsSurfaceControlSide = (
	context: BlockControlUIContext | undefined,
	reliableAnchorEnabled: boolean,
): 'left' | undefined =>
	context?.targetNode.type.name === 'layoutColumn' ||
	(Boolean(context) && reliableAnchorEnabled && context?.targetNode.parentType !== 'doc')
		? undefined
		: 'left';

const getNodeContext = (state: EditorState, pos: number): BlockControlUIContextNode | undefined => {
	const node = state.doc.nodeAt(pos);
	if (!node) {
		return undefined;
	}

	const $pos = state.doc.resolve(pos);
	const ancestors: BlockControlUIContextAncestor[] = [];
	for (let depth = 0; depth <= $pos.depth; depth++) {
		const ancestor = $pos.node(depth);
		ancestors.push({
			depth,
			pos: depth === 0 ? 0 : $pos.before(depth),
			type: { name: ancestor.type.name },
		});
	}

	return {
		ancestors,
		depth: $pos.depth + 1,
		node,
		parentType: $pos.parent.type.name,
		pos,
		type: { name: node.type.name },
	};
};

export const createBlockControlsSurfaceContextForPosition = (
	state: EditorState,
	targetPos: number,
	activeNode?: ActiveNode,
): BlockControlUIContext | undefined => {
	const targetNodeContext = getNodeContext(state, targetPos);
	if (!targetNodeContext) {
		return undefined;
	}

	const activeNodeContext = activeNode ? getNodeContext(state, activeNode.pos) : undefined;
	const rootPos = activeNode ? (activeNode.rootPos ?? activeNode.pos) : targetPos;
	const rootNodeContext = getNodeContext(state, rootPos) ?? targetNodeContext;

	return {
		activeControlKey: activeNode?.controlKey,
		activeNode:
			activeNode && activeNodeContext
				? {
						...activeNodeContext,
						rootPos,
						rootType: { name: activeNode.rootNodeType ?? rootNodeContext.type.name },
					}
				: undefined,
		rootNode: rootNodeContext,
		targetNode: targetNodeContext,
	};
};

export const createBlockControlsSurfaceContext = (
	view: EditorView,
	activeNode: ActiveNode | undefined,
	target: 'active' | 'root' = 'root',
): BlockControlUIContext | undefined => {
	if (!activeNode) {
		return undefined;
	}

	const rootPos = activeNode.rootPos ?? activeNode.pos;
	return createBlockControlsSurfaceContextForPosition(
		view.state,
		target === 'active' ? activeNode.pos : rootPos,
		activeNode,
	);
};
