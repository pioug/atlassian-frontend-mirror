import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import { willComponentRender } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { ResolvedSurface } from '@atlaskit/editor-ui-control-model/surface-renderer/types';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';

import type { ActiveNode } from '../../blockControlsPluginType';
import { createBlockControlsSurfaceContextForPosition } from '../../ui/block-controls-surface-context';
import { hasSurfaceControls } from '../../ui/utils/has-surface-controls';

const createSurfaceContextAtPosition = (
	state: EditorState,
	position: number,
	activeNode?: ActiveNode,
) => {
	const blockControlsContext = createBlockControlsSurfaceContextForPosition(
		state,
		position,
		activeNode,
	);
	return blockControlsContext
		? createSurfaceContext(BLOCK_CONTROL_UI_CONTEXT, blockControlsContext)
		: undefined;
};

/**
 * A position qualifies as soon as ANY of the given surfaces would render something for it.
 * The surface context depends only on state/position/activeNode, not on which surface is being
 * checked, so it's built once here rather than once per surface inside the `.some()`.
 */
const willAnySurfaceRenderAt = (
	surfaces: readonly { childrenMap: ResolvedSurface['childrenMap']; root: RegisterComponent }[],
	state: EditorState,
	position: number,
	activeNode: ActiveNode | undefined,
): boolean => {
	const surfaceContext = createSurfaceContextAtPosition(state, position, activeNode);
	return surfaces.some(({ childrenMap, root }) =>
		willComponentRender(root, childrenMap, surfaceContext),
	);
};

export const getSurfaceNodePositions = (
	state: EditorState,
	resolvedSurfaces: readonly ResolvedSurface[],
	activeNode?: ActiveNode,
	from = 0,
	to: number = state.doc.content.size,
): number[] => {
	const surfaces = resolvedSurfaces.flatMap(({ childrenMap, components, root }) =>
		root && hasSurfaceControls(components) ? [{ childrenMap, root }] : [],
	);
	if (surfaces.length === 0) {
		return [];
	}

	const positions: number[] = [];
	const start = Math.max(0, from);
	const end = Math.min(state.doc.content.size, Math.max(start, to));

	state.doc.nodesBetween(start, end, (node, position) => {
		if (node.isBlock && willAnySurfaceRenderAt(surfaces, state, position, activeNode)) {
			positions.push(position);
		}
	});

	return positions;
};

const hasActiveNodeChanged = (
	previousActiveNode: ActiveNode | null | undefined,
	activeNode: ActiveNode | null | undefined,
): boolean =>
	previousActiveNode?.pos !== activeNode?.pos ||
	previousActiveNode?.nodeType !== activeNode?.nodeType ||
	previousActiveNode?.rootPos !== activeNode?.rootPos;

export const updateSurfaceNodePositions = ({
	activeNode,
	currentPositions,
	from,
	newState,
	previousActiveNode,
	resolvedSurfaces,
	to,
	tr,
}: {
	activeNode: ActiveNode | null | undefined;
	currentPositions: number[];
	from: number;
	newState: EditorState;
	previousActiveNode: ActiveNode | null | undefined;
	resolvedSurfaces: readonly ResolvedSurface[];
	to: number;
	tr: ReadonlyTransaction;
}): number[] => {
	const activeNodeChanged = hasActiveNodeChanged(previousActiveNode, activeNode);
	if (!tr.docChanged && !activeNodeChanged) {
		return currentPositions;
	}

	const nextActiveNode = activeNode ?? undefined;
	if (activeNodeChanged) {
		return getSurfaceNodePositions(newState, resolvedSurfaces, nextActiveNode);
	}

	const surfaces = resolvedSurfaces.flatMap(({ childrenMap, components, root }) =>
		root && hasSurfaceControls(components) ? [{ childrenMap, root }] : [],
	);
	const mappedPositions = currentPositions
		.map((position) => tr.mapping.mapResult(position, -1))
		.filter((result) => !result.deleted)
		.map((result) => result.pos)
		.filter((position) => {
			const node = newState.doc.nodeAt(position);
			return Boolean(
				node?.isBlock && willAnySurfaceRenderAt(surfaces, newState, position, nextActiveNode),
			);
		});
	const changedPositions = getSurfaceNodePositions(
		newState,
		resolvedSurfaces,
		nextActiveNode,
		from - 1,
		to + 1,
	);

	return Array.from(new Set([...mappedPositions, ...changedPositions])).sort(
		(first, second) => first - second,
	);
};
