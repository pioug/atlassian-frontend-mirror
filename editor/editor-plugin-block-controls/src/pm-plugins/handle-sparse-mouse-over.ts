import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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

/** Resolves hover from PM structure so the first hover can create its sparse candidate. */
export const handleSparseMouseOver = (
	view: EditorView,
	event: Event,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
): boolean => {
	const controls = api?.blockControls.sharedState.currentState();
	if (
		!api ||
		controls?.isDragging ||
		!(event.target instanceof Element) ||
		event.target === view.dom
	) {
		return false;
	}

	const editorDisabled = api.editorDisabled?.sharedState.currentState()?.editorDisabled ?? false;
	const editorViewMode = api.editorViewMode?.sharedState.currentState()?.mode;
	if (editorDisabled && (editorViewMode !== 'view' || !controls?.rightSideControlsEnabled)) {
		return false;
	}
	const isDisplayingDiff = api.showDiff?.sharedState.currentState()?.isDisplayingChanges ?? false;
	const currentUserIntent = api.userIntent?.sharedState.currentState()?.currentUserIntent;
	if (
		(isDisplayingDiff || currentUserIntent === 'reviewing') &&
		expValEqualsNoExposure('platform_editor_diff_plugin_extended', 'isEnabled', true)
	) {
		return false;
	}

	let position: number;
	try {
		position = view.posAtDOM(event.target, 0);
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
		if (nodeAfterDOM instanceof Element && nodeAfterDOM.contains(event.target)) {
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
	const target = redirectParagraphToWrappedMedia(
		view,
		view.state.doc.resolve(targetPosition),
		targetPosition,
	);
	targetPosition = target.position;
	const node = target.node;
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

	if (
		node.type.name === 'layoutColumn' &&
		parentNode.type.name === 'layoutSection' &&
		parentNode.childCount === 1 &&
		expValEqualsNoExposure('advanced_layouts', 'isEnabled', true) &&
		!expValEquals('platform_editor_layout_column_menu', 'isEnabled', true)
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
