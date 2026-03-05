import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { clearHoverSide, mouseEnter, mouseLeave, setHoverSide, stopEditing } from './commands';
import { getInteractionTrackingState } from './pm-plugin';

/** Per-view pending hover state; avoids cross-editor singleton. */
const pendingByView = new WeakMap<EditorView, MouseEvent>();

/** Per-view RAF handle so clearPendingHoverSide cancels only that view's callback. */
const rafIdByView = new WeakMap<EditorView, number>();

const cancelScheduledProcessForView = (view: EditorView) => {
	const id = rafIdByView.get(view);
	if (id !== undefined) {
		cancelAnimationFrame(id);
		rafIdByView.delete(view);
	}
};

const clearPendingHoverSide = (view: EditorView) => {
	pendingByView.delete(view);
	cancelScheduledProcessForView(view);
};

const BLOCK_SELECTORS = '[data-node-anchor], [data-drag-handler-anchor-name]';

const RIGHT_EDGE_SELECTOR = '[data-blocks-right-edge-button-container]';

/**
 * Process hover position and set left/right side. Only invoked when right-side controls are
 * enabled (confluence_remix_icon_right_side); handleMouseMove returns early otherwise.
 */
const processHoverSide = (view: EditorView) => {
	const event = pendingByView.get(view);
	if (!event) {
		return;
	}
	pendingByView.delete(view);
	rafIdByView.delete(view);

	const editorContentArea = view.dom.closest('.ak-editor-content-area');
	if (!(editorContentArea instanceof HTMLElement)) {
		return;
	}

	const state = getInteractionTrackingState(view.state);
	const target = event.target instanceof HTMLElement ? event.target : null;

	// When hovering over block controls directly, infer side from which control we're over.
	// This is more reliable than bounds when controls are in portals outside the editor DOM.
	const rightEdgeElement = target?.closest(RIGHT_EDGE_SELECTOR);
	if (rightEdgeElement) {
		if (state?.hoverSide !== 'right') {
			setHoverSide(view, 'right');
		}
		return;
	}
	const leftControlElement = target?.closest(
		'[data-blocks-drag-handle-container], [data-testid="block-ctrl-drag-handle"], [data-testid="block-ctrl-drag-handle-container"], [data-testid="block-ctrl-decorator-widget"], [data-testid="block-ctrl-quick-insert-button"]',
	);
	if (leftControlElement) {
		if (state?.hoverSide !== 'left') {
			setHoverSide(view, 'left');
		}
		return;
	}

	// Primary path: depth-1 block (doc direct child). Decorations-anchor sets [data-drag-handler-anchor-depth="1"]
	// on every root block (table, layoutSection, expand, etc.), so we get the whole block without per-type logic.
	const blockElement = target?.closest(BLOCK_SELECTORS);
	const depth1Block =
		blockElement instanceof HTMLElement
			? blockElement.closest('[data-drag-handler-anchor-depth="1"]')
			: null;

	const boundsElement: HTMLElement | null =
		depth1Block instanceof HTMLElement ? depth1Block : editorContentArea;

	if (!boundsElement) {
		if (state?.hoverSide !== undefined) {
			clearHoverSide(view);
		}
		return;
	}

	const { left, right } = boundsElement.getBoundingClientRect();
	const midpoint = (left + right) / 2;
	const nextHoverSide = event.clientX > midpoint ? 'right' : 'left';

	if (state?.hoverSide !== nextHoverSide) {
		setHoverSide(view, nextHoverSide);
	}
};

export const handleMouseMove = (
	view: EditorView,
	event: Event,
	rightSideControlsEnabled = false,
) => {
	const state = getInteractionTrackingState(view.state);
	// if user has stopped editing and moved their mouse, show block controls again
	if (state?.isEditing) {
		stopEditing(view);
	}

	// Only track hover side when right-side controls are enabled (single source: confluence_remix_icon_right_side via config)
	if (!rightSideControlsEnabled) {
		return false;
	}

	if (!(event instanceof MouseEvent)) {
		return false;
	}

	pendingByView.set(view, event);
	cancelScheduledProcessForView(view);
	const id = requestAnimationFrame(() => {
		processHoverSide(view);
	});
	rafIdByView.set(view, id);

	return false;
};

export const handleMouseLeave = (view: EditorView, rightSideControlsEnabled = false) => {
	if (rightSideControlsEnabled) {
		clearPendingHoverSide(view);
	}
	mouseLeave(view);
	return false;
};

export const handleMouseEnter = (view: EditorView) => {
	mouseEnter(view);
	return false;
};
