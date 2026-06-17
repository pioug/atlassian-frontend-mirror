import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';
import { handleMouseOver } from '../handle-mouse-over';

import { clearHoverSide, mouseEnter, mouseLeave, setHoverSide, stopEditing } from './commands';
import { RIGHT_MARGIN_ROVO_GAP_PX } from './constants';
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

// Top-level blocks (no block ancestor), matched by anchor attribute so it works under both the
// legacy and native-anchor schemes.
const getRootBlocks = (view: EditorView): HTMLElement[] =>
	Array.from(view.dom.querySelectorAll<HTMLElement>(BLOCK_SELECTORS)).filter(
		(el) => !el.parentElement?.closest(BLOCK_SELECTORS),
	);

// Find the root block whose vertical bounds contain clientY. Returns the measured rect so callers
// can reuse it without re-measuring.
const findBlockAtY = (
	view: EditorView,
	clientY: number,
): { block: HTMLElement; rect: DOMRect } | null => {
	for (const el of getRootBlocks(view)) {
		const rect = el.getBoundingClientRect();
		if (clientY >= rect.top && clientY <= rect.bottom) {
			return { block: el, rect };
		}
	}
	return null;
};

const getRightMarginBoundary = (view: EditorView): number =>
	(view.dom.ownerDocument.defaultView?.innerWidth ?? Number.POSITIVE_INFINITY) -
	RIGHT_MARGIN_ROVO_GAP_PX;

type RightMarginZone =
	| { block: HTMLElement; type: 'active' } // beside a block, before the Rovo gap
	| { type: 'gap' } // past the gap boundary, reserved for the Rovo button
	| null; // not in the right margin

// Classify where the cursor sits in the right margin beside the block at its height, running the
// block lookup once so the caller doesn't traverse the DOM twice per mousemove.
const classifyRightMarginPosition = (view: EditorView, event: MouseEvent): RightMarginZone => {
	const found = findBlockAtY(view, event.clientY);
	if (!found) {
		return null;
	}
	if (event.clientX <= found.rect.right) {
		return null;
	}
	return event.clientX > getRightMarginBoundary(view)
		? { type: 'gap' }
		: { type: 'active', block: found.block };
};

/**
 * Process hover position and set left/right side. Only invoked when right-side controls are
 * enabled (confluence_remix_button_right_side_block_fg); handleMouseMove returns early otherwise.
 */
const processHoverSide = (view: EditorView, api?: ExtractInjectionAPI<BlockControlsPlugin>) => {
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

	// Added right-margin hover, gated so it can be rolled back. When off, fall through to midpoint.
	if (editorExperiment('remix_button_right_margin_hover', true)) {
		const closestBlock = target?.closest(BLOCK_SELECTORS);
		const blockElement = closestBlock instanceof HTMLElement ? closestBlock : null;

		// Not over a block: the cursor may be in the right margin beside content.
		const marginZone = blockElement ? null : classifyRightMarginPosition(view, event);

		if (marginZone?.type === 'active' && api) {
			// handleMouseOver only reads event.target, so a target-only stand-in is enough here.
			handleMouseOver(view, { target: marginZone.block } as unknown as Event, api);
			// mouseenter doesn't fire over the click overlay, so clear isMouseOut here to re-show.
			if (state?.isMouseOut) {
				mouseEnter(view);
			}
			if (state?.hoverSide !== 'right') {
				setHoverSide(view, 'right');
			}
			return;
		}

		// In the Rovo gap, dismiss the controls so the button doesn't linger over the Rovo button.
		if (marginZone?.type === 'gap' || event.clientX > getRightMarginBoundary(view)) {
			if (!state?.isMouseOut) {
				clearHoverSide(view);
				mouseLeave(view);
			}
			return;
		}

		// Over a block: fall through to the midpoint split so the left half keeps the drag handle and
		// the right half shows the Remix button, matching the experiment-off behaviour.
	}

	// Pick the side from the content midpoint, keeping the original left/right halves.
	const { left, right } = editorContentArea.getBoundingClientRect();
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
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
): boolean => {
	const state = getInteractionTrackingState(view.state);
	// if user has stopped editing and moved their mouse, show block controls again
	if (state?.isEditing) {
		stopEditing(view);
	}

	// Only track hover side when right-side controls are enabled (single source: confluence_remix_button_right_side_block_fg via config)
	if (!rightSideControlsEnabled) {
		return false;
	}

	if (!(event instanceof MouseEvent)) {
		return false;
	}

	pendingByView.set(view, event);
	cancelScheduledProcessForView(view);
	const id = requestAnimationFrame(() => {
		processHoverSide(view, api);
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
