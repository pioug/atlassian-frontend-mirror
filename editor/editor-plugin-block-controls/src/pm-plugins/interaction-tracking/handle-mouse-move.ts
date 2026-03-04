import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	clearHoverSide,
	mouseEnter,
	mouseLeave,
	setHoverSide,
	stopEditing,
} from './commands';
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

const TABLE_SELECTOR = '[data-prosemirror-node-name="table"]';

const RIGHT_EDGE_SELECTOR = '[data-blocks-right-edge-button-container]';

const isInsideTable = (element: HTMLElement): boolean =>
	element.closest(TABLE_SELECTOR) !== null ||
	element.getAttribute?.('data-prosemirror-node-name') === 'table';

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

	// Use the hovered block's midpoint when hovering over block content.
	const blockElement = target?.closest(BLOCK_SELECTORS);
	const boundsElement =
		blockElement instanceof HTMLElement ? blockElement : editorContentArea;

	// Tables show block controls at table level; don't restrict by side so drag handle
	// stays visible when hovering anywhere in the table (e.g. paragraph in second cell).
	if (isInsideTable(boundsElement)) {
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

	// Only track hover side when right-side controls are enabled and experiment is on (performance)
	if (
		!rightSideControlsEnabled ||
		!expValEquals('confluence_remix_icon_right_side', 'isEnabled', true)
	) {
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

export const handleMouseLeave = (
	view: EditorView,
	rightSideControlsEnabled = false,
) => {
	if (rightSideControlsEnabled && expValEquals('confluence_remix_icon_right_side', 'isEnabled', true)) {
		clearPendingHoverSide(view);
	}
	mouseLeave(view);
	return false;
};

export const handleMouseEnter = (view: EditorView) => {
	mouseEnter(view);
	return false;
};
