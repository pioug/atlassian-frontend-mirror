import { getNodeIdProvider } from '@atlaskit/editor-common/node-anchor';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { getNodeTypeWithLevel } from './decorations-common';

const OPAQUE_BLOCKS = new Set([
	'table',
	'bulletList',
	'orderedList',
	'taskList',
	'decisionList',
	'mediaSingle',
]);
const EXCLUDED_BLOCKS = new Set(['listItem', 'tableRow', 'tableCell', 'tableHeader', 'caption']);

const isPanelNodeTypeName = (nodeTypeName: string | null | undefined): boolean =>
	nodeTypeName === 'panel' ||
	(nodeTypeName === 'panel_c1' &&
		expValEqualsNoExposure('platform_editor_controls_reliable_anchor', 'isEnabled', true) &&
		fg('platform_editor_controls_reliable_anchor_patch_1'));

const redirectParagraphToWrappedMedia = (
	view: EditorView,
	$target: ResolvedPos,
	targetPosition: number,
): { node: PMNode | null; position: number } => {
	const node = view.state.doc.nodeAt(targetPosition);
	if (!node || node.type.name !== 'paragraph') {
		return { position: targetPosition, node };
	}

	const index = $target.index();
	for (const siblingIndex of [index - 1, index + 1]) {
		if (siblingIndex < 0 || siblingIndex >= $target.parent.childCount) {
			continue;
		}
		const sibling = $target.parent.child(siblingIndex);
		if (
			(sibling.type.name === 'mediaSingle' || sibling.type.name === 'embedCard') &&
			(sibling.attrs.layout === 'wrap-left' || sibling.attrs.layout === 'wrap-right')
		) {
			return {
				position:
					siblingIndex < index ? targetPosition - sibling.nodeSize : targetPosition + node.nodeSize,
				node: sibling,
			};
		}
	}
	return { position: targetPosition, node };
};

/** Whether hovering must not show block controls under sparse surfaces. */
export const isSparseHoverSuppressed = (
	view: EditorView,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
): boolean => {
	if (
		api?.limitedMode?.sharedState.currentState()?.enabled ||
		getNodeIdProvider(view)?.isLimitedMode()
	) {
		return true;
	}
	const controls = api?.blockControls.sharedState.currentState();
	if (controls?.isDragging || api?.typeAhead?.sharedState.currentState()?.isOpen) {
		return true;
	}
	const editorDisabled = api?.editorDisabled?.sharedState.currentState()?.editorDisabled ?? false;
	const editorViewMode = api?.editorViewMode?.sharedState.currentState()?.mode;
	if (editorDisabled && (editorViewMode !== 'view' || !controls?.rightSideControlsEnabled)) {
		return true;
	}
	const isDisplayingDiff = api?.showDiff?.sharedState.currentState()?.isDisplayingChanges ?? false;
	return (
		isDisplayingDiff ||
		api?.userIntent?.sharedState.currentState()?.currentUserIntent === 'reviewing'
	);
};

/**
 * Shows controls for the block that owns `target`, resolved from PM structure so the first hover
 * can create its sparse candidate. Callers check `isSparseHoverSuppressed` first.
 */
export const handleSparseHoverTarget = (
	view: EditorView,
	target: Element,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
): boolean => {
	if (!api || target === view.dom) {
		return false;
	}
	const controls = api.blockControls.sharedState.currentState();

	let position: number;
	try {
		position = view.posAtDOM(target, 0);
	} catch {
		return false;
	}

	const $pos = view.state.doc.resolve(position);
	let targetPosition: number | undefined;
	let opaque = false;
	for (let depth = 1; depth <= $pos.depth; depth++) {
		const node = $pos.node(depth);
		if (!node.isBlock || EXCLUDED_BLOCKS.has(node.type.name)) {
			continue;
		}
		targetPosition = $pos.before(depth);
		if (OPAQUE_BLOCKS.has(node.type.name)) {
			opaque = true;
			break;
		}
	}
	if (!opaque && $pos.nodeAfter?.isBlock && !EXCLUDED_BLOCKS.has($pos.nodeAfter.type.name)) {
		// Browser positions over non-editable node chrome can resolve to the first editable child.
		// Keep the ancestor unless that child actually owns the hovered DOM target.
		const nodeAfterDOM = view.nodeDOM(position);
		if (nodeAfterDOM instanceof Element && nodeAfterDOM.contains(target)) {
			targetPosition = position;
		}
	}
	if (targetPosition === undefined) {
		return false;
	}

	const initialNode = view.state.doc.nodeAt(targetPosition);
	if (!initialNode) {
		return false;
	}
	const redirected = redirectParagraphToWrappedMedia(
		view,
		view.state.doc.resolve(targetPosition),
		targetPosition,
	);
	targetPosition = redirected.position;
	const node = redirected.node;
	if (!node || controls?.activeNode?.pos === targetPosition) {
		return false;
	}

	const $target = view.state.doc.resolve(targetPosition);
	if (
		$target.depth > 0 &&
		(node.type.name === 'paragraph' || node.type.name === 'heading') &&
		node.content.size === 0
	) {
		return false;
	}

	const parentNode = $target.parent;
	const parentPosition = $target.depth > 0 ? $target.before($target.depth) : undefined;
	const parentDOM = parentPosition === undefined ? undefined : view.nodeDOM(parentPosition);
	if (
		isPanelNodeTypeName(parentNode.type.name) &&
		!(
			parentDOM instanceof HTMLElement && parentDOM.classList.contains('ak-editor-panel__no-icon')
		) &&
		$target.index() === 0
	) {
		return false;
	}

	const anchors = controls?.surfaceAnchors;
	const anchorName =
		anchors?.get(targetPosition) ?? api.core.actions.getAnchorIdForNode(node, targetPosition);
	const rootPos = $target.depth > 0 ? $target.before(1) : targetPosition;
	const rootNode = view.state.doc.nodeAt(rootPos);
	const rootAnchorName =
		anchors?.get(rootPos) ??
		(rootNode ? api.core.actions.getAnchorIdForNode(rootNode, rootPos) : undefined);
	if (!anchorName || !rootNode) {
		return false;
	}

	api.core.actions.execute(
		api.blockControls.commands.showDragHandleAt(
			targetPosition,
			anchorName,
			getNodeTypeWithLevel(node),
			undefined,
			rootPos,
			rootAnchorName ?? anchorName,
			getNodeTypeWithLevel(rootNode),
		),
	);
	return false;
};
