import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';
import { handleMouseOver } from '../handle-mouse-over';
import { createAfterRenderScheduler } from '../utils/after-render-scheduler';
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

export const clearPendingHoverSide = (view: EditorView): void => {
	pendingByView.delete(view);
	cancelScheduledProcessForView(view);
	if (isExperimentEnabled('platform_editor_improve_inp_batch_3')) {
		cancelHoverSideAfterRender(view);
	}
};

const BLOCK_SELECTORS = '[data-node-anchor], [data-drag-handler-anchor-name]';

const LEGACY_RIGHT_EDGE_SELECTOR = '[data-blocks-right-edge-button-container]';
const getRightControlSelector = (): string =>
	isExperimentEnabled('platform_editor_block_control_migration')
		? `[data-editor-block-controls-side="right"], ${LEGACY_RIGHT_EDGE_SELECTOR}`
		: LEGACY_RIGHT_EDGE_SELECTOR;

const LEGACY_LEFT_CONTROL_SELECTOR =
	'[data-blocks-drag-handle-container], [data-testid="block-ctrl-drag-handle"], [data-testid="block-ctrl-drag-handle-container"], [data-testid="block-ctrl-decorator-widget"], [data-testid="block-ctrl-quick-insert-button"]';

const getLeftControlSelector = (): string =>
	isExperimentEnabled('platform_editor_block_control_migration')
		? `[data-editor-block-ctrl-drag-handle], ${LEGACY_LEFT_CONTROL_SELECTOR}`
		: LEGACY_LEFT_CONTROL_SELECTOR;

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
	| { block: HTMLElement; type: 'active' } // beside a block in the hoverable right margin
	| null; // not in the right margin

// Classify where the cursor sits in the right margin beside the block at its height, running the
// block lookup once so the caller doesn't traverse the DOM twice per mousemove.
const classifyRightMarginPosition = (view: EditorView, event: MouseEvent): RightMarginZone => {
	if (isExperimentEnabled('platform_editor_improve_inp_batch_3')) {
		return classifyRightMarginPositionByHitTest(view, event);
	}
	const found = findBlockAtY(view, event.clientY);
	if (!found) {
		return null;
	}
	if (event.clientX <= found.rect.right) {
		return null;
	}
	return { type: 'active', block: found.block };
};

/**
 * Process hover position and set left/right side. Only invoked when right-side controls are
 * enabled; handleMouseMove returns early otherwise.
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

	// EDITOR-7926: skip hover-side tracking while a diff is on screen (or a suggestion card is open)
	// so setHoverSide/mouseEnter don't flip-flop and jitter the controls.
	const currentUserIntent = api?.userIntent?.sharedState.currentState()?.currentUserIntent;
	const isDisplayingDiff = api?.showDiff?.sharedState.currentState()?.isDisplayingChanges ?? false;
	if (isDisplayingDiff || currentUserIntent === 'reviewing') {
		return;
	}

	// When hovering over block controls directly, infer side from which control we're over.
	// This is more reliable than bounds when controls are in portals outside the editor DOM.
	const rightEdgeElement = target?.closest(getRightControlSelector());
	if (rightEdgeElement) {
		if (state?.isMouseOut) {
			mouseEnter(view, 'right');
			return;
		}
		if (state?.hoverSide !== 'right') {
			setHoverSide(view, 'right');
		}
		return;
	}
	const leftControlElement = target?.closest(getLeftControlSelector());
	if (leftControlElement) {
		if (state?.hoverSide !== 'left') {
			setHoverSide(view, 'left');
		}
		return;
	}

	const closestBlock = target?.closest(BLOCK_SELECTORS);
	const blockElement = closestBlock instanceof HTMLElement ? closestBlock : null;

	// Not over a block: the cursor may be in the right margin beside content.
	const marginZone = blockElement ? null : classifyRightMarginPosition(view, event);

	if (marginZone?.type === 'active' && api) {
		// handleMouseOver only reads event.target, so a target-only stand-in is enough here.
		handleMouseOver(view, { target: marginZone.block } as unknown as Event, api);
		// mouseenter doesn't fire over the click overlay, so clear isMouseOut here to re-show.
		if (state?.isMouseOut) {
			mouseEnter(view, 'right');
			return;
		}
		if (state?.hoverSide !== 'right') {
			setHoverSide(view, 'right');
		}
		return;
	}

	// Explicitly marked control surfaces handle the Rovo area, so the rest of the right margin
	// remains hoverable; only clear hover when past the boundary and not over a block.
	if (event.clientX > getRightMarginBoundary(view) && !blockElement) {
		if (!state?.isMouseOut) {
			clearHoverSide(view);
			mouseLeave(view);
		}
		return;
	}

	// Over a block: fall through to the midpoint split so the left half keeps the drag handle and
	// the right half shows the Remix button.

	// Pick the side from the content midpoint, keeping the original left/right halves.
	const { left, right } = editorContentArea.getBoundingClientRect();
	const midpoint = (left + right) / 2;
	const nextHoverSide = event.clientX > midpoint ? 'right' : 'left';

	if (state?.hoverSide !== nextHoverSide) {
		if (state?.isMouseOut && target?.closest(BLOCK_SELECTORS)) {
			mouseEnter(view, nextHoverSide);
			return;
		}

		setHoverSide(view, nextHoverSide);
	}
};

export const handleMouseMove = (
	view: EditorView,
	event: Event,
	rightSideControlsEnabled?: boolean,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
): boolean => {
	if (
		rightSideControlsEnabled &&
		event instanceof MouseEvent &&
		isExperimentEnabled('platform_editor_improve_inp_batch_3')
	) {
		return handleMouseMoveAfterRender(view, event, api);
	}
	const state = getInteractionTrackingState(view.state);
	// if user has stopped editing and moved their mouse, show block controls again
	if (state?.isEditing) {
		stopEditing(view);
	}

	// Only track hover side when right-side controls are enabled.
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

export const handleMouseLeave = (view: EditorView, rightSideControlsEnabled?: boolean): boolean => {
	if (rightSideControlsEnabled) {
		clearPendingHoverSide(view);
	}
	mouseLeave(view);
	return false;
};

export const handleMouseEnter = (view: EditorView): boolean => {
	mouseEnter(view);
	return false;
};

/* -------------------------------------------------------------------------------------------------
 * EDITOR-9730: platform_editor_improve_inp_batch_3
 *
 * Everything below is the treatment path, reached through these gates only:
 *   - handleMouseMove          -> handleMouseMoveAfterRender
 *   - classifyRightMarginPosition -> classifyRightMarginPositionByHitTest
 *   - clearPendingHoverSide    -> cancelHoverSideAfterRender
 * Clean-up when the experiment ships: delete this section, take the treatment branch at each gate
 * (dropping findBlockAtY, getRootBlocks, the rAF bookkeeping and the legacy handleMouseMove body),
 * and remove the gated calls in pm-plugin.ts and handle-key-down.ts.
 * ---------------------------------------------------------------------------------------------- */

type AfterRenderState = {
	api?: ExtractInjectionAPI<BlockControlsPlugin>;
	scheduler: ReturnType<typeof createAfterRenderScheduler>;
};

/** Per-view scheduler plus the latest plugin API to use when it runs. */
const afterRenderByView = new WeakMap<EditorView, AfterRenderState>();

const cancelHoverSideAfterRender = (view: EditorView): void => {
	afterRenderByView.get(view)?.scheduler.cancel();
};

const processHoverSideAfterRender = (view: EditorView) => {
	const state = afterRenderByView.get(view);
	if (!state || view.isDestroyed || !pendingByView.has(view)) {
		return;
	}
	processHoverSide(view, state.api);

	// The typing state is cleared last, after every read above has finished, so no layout read
	// follows one of our own writes. Typing cancels pending work (see handle-key-down.ts), so this
	// never undoes a newer keystroke.
	if (getInteractionTrackingState(view.state)?.isEditing) {
		stopEditing(view);
	}
};

const handleMouseMoveAfterRender = (
	view: EditorView,
	event: MouseEvent,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
): boolean => {
	const win = view.dom.ownerDocument.defaultView;
	if (!win) {
		return false;
	}
	pendingByView.set(view, event);
	let state = afterRenderByView.get(view);
	if (!state) {
		state = {
			api,
			scheduler: createAfterRenderScheduler(win, () => processHoverSideAfterRender(view)),
		};
		afterRenderByView.set(view, state);
	}
	// The latest event and API win when several moves coalesce into one run.
	state.api = api;
	// Reads run after the next frame renders, giving the browser an opportunity to update layout
	// first (other work can still dirty it).
	state.scheduler.schedule();
	return false;
};

// Walk up from a block to its top-level block (no block ancestor). Cost is bounded by nesting
// depth, matching getRootBlocks' filter without scanning the whole document.
const toRootBlock = (block: HTMLElement): HTMLElement => {
	let root = block;
	let parent = root.parentElement?.closest(BLOCK_SELECTORS);
	while (parent instanceof HTMLElement) {
		root = parent;
		parent = root.parentElement?.closest(BLOCK_SELECTORS);
	}
	return root;
};

// Right-margin lookup without the document-wide scan (EDITOR-9730): when the cursor is past the
// right edge of the editor content, hit-test once just inside that edge at the cursor's height and
// resolve the top-level block there.
//
// This still reads layout (getBoundingClientRect and elementFromPoint), so like findBlockAtY it
// forces a synchronous layout if layout is dirty when it runs. What changes is how much and when:
// one rect and one hit test instead of a rect per top-level block, and it runs in the
// after-render callback, where the browser has had an opportunity to update layout first.
const findRootBlockBesideCursor = (view: EditorView, event: MouseEvent): HTMLElement | null => {
	const contentRight = view.dom.getBoundingClientRect().right;
	if (event.clientX <= contentRight) {
		return null;
	}
	const root = view.root as Document | ShadowRoot;
	if (typeof root.elementFromPoint !== 'function') {
		return null;
	}
	const block = root.elementFromPoint(contentRight - 1, event.clientY)?.closest(BLOCK_SELECTORS);
	if (!(block instanceof HTMLElement)) {
		return null;
	}
	const rootBlock = toRootBlock(block);
	return view.dom.contains(rootBlock) ? rootBlock : null;
};

// Same classification as the legacy path, with the block found by a hit test.
const classifyRightMarginPositionByHitTest = (
	view: EditorView,
	event: MouseEvent,
): RightMarginZone => {
	const block = findRootBlockBesideCursor(view, event);
	if (!block) {
		return null;
	}
	return { type: 'active', block };
};
