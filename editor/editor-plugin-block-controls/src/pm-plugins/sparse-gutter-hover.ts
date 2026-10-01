import { bind } from 'bind-event-listener';

import { DRAG_HANDLE_WIDTH } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFullPageNarrowBreakout,
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
} from '@atlaskit/editor-shared-styles/constants';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { BLOCK_CONTROLS_SURFACE_SELECTOR, DRAG_HANDLE_MAX_WIDTH_PLUS_GAP } from '../ui/consts';
import { handleSparseHoverTarget, isSparseHoverSuppressed } from './handle-sparse-hover-target';
import { mouseEnter, setHoverSide, stopEditing } from './interaction-tracking/commands';
import { handleMouseLeave } from './interaction-tracking/handle-mouse-move';
import { getInteractionTrackingState } from './interaction-tracking/pm-plugin';
import { getVisibleBox } from './utils/visible-box';

const BLOCK_SELECTOR = '[data-prosemirror-node-block="true"]';
const TABLE_SELECTOR = '[data-prosemirror-node-name="table"]';
const LAYOUT_SECTION_SELECTOR = '[data-prosemirror-node-name="layoutSection"]';
const LAYOUT_COLUMN_SELECTOR = '[data-prosemirror-node-name="layoutColumn"]';

// `layoutColumnExtendedHoverZone` is a DRAG_HANDLE_WIDTH-tall strip centred on the column's top edge.
const LAYOUT_COLUMN_STRIP_REACH = DRAG_HANDLE_WIDTH / 2;

type GutterWidths = {
	narrowTopLevel: number | undefined;
	topLevel: number;
};

const isBlockElement = (element: Element): boolean =>
	element.getAttribute('data-prosemirror-node-block') === 'true';

const getVisibleLeft = (block: Element): number =>
	getVisibleBox(
		block,
		block.getAttribute('data-prosemirror-node-name') ?? '',
	).getBoundingClientRect().left;

/**
 * Whether the element under the pointer can be part of a block's left gutter: a container block's
 * own padding (panel, layout, list…) or an editor wrapper around the content. Text and leaf blocks
 * have no gutter inside them, and neither do tables: like the legacy hover zones, anywhere inside a
 * table, including cell padding, shows the table's controls. Elements rendered beside the editor
 * (title, popups, toolbars) cover any gutter beneath them.
 */
export const isPossibleGutterElement = (
	view: EditorView,
	hoveredElement: EventTarget | null,
): hoveredElement is Element => {
	if (!(hoveredElement instanceof Element)) {
		return false;
	}
	const owner = hoveredElement.closest(`${BLOCK_SELECTOR}, ${BLOCK_CONTROLS_SURFACE_SELECTOR}`);
	if (owner?.matches(BLOCK_CONTROLS_SURFACE_SELECTOR)) {
		return false;
	}
	if (owner && view.dom.contains(owner)) {
		if (owner.closest(TABLE_SELECTOR)) {
			return false;
		}
		const nodeType =
			view.state.schema.nodes[owner.getAttribute('data-prosemirror-node-name') ?? ''];
		return !nodeType?.isTextblock && !nodeType?.isLeaf;
	}
	return view.dom.contains(hoveredElement) || hoveredElement.contains(view.dom);
};

const getGutterWidths = (): GutterWidths => ({
	topLevel: akEditorGutterPaddingDynamic(),
	narrowTopLevel: expValEqualsNoExposure(
		'platform_editor_preview_panel_responsiveness',
		'isEnabled',
		true,
	)
		? akEditorGutterPaddingReduced
		: undefined,
});

const getTopLevelGutterWidth = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	widths: GutterWidths,
): number => {
	const editorWidth = api?.width?.sharedState.currentState()?.width;
	return widths.narrowTopLevel !== undefined &&
		editorWidth !== undefined &&
		editorWidth <= akEditorFullPageNarrowBreakout
		? widths.narrowTopLevel
		: widths.topLevel;
};

const getEditorElementAt = (view: EditorView, clientX: number, clientY: number): Element | null => {
	const element = view.dom.ownerDocument.elementFromPoint(clientX, clientY);
	return element && element !== view.dom && view.dom.contains(element) ? element : null;
};

/** The outermost block around `element` that does not contain the pointer owns that gutter. */
const findGutterOwner = (view: EditorView, element: Element, pointerTarget: Element) => {
	let owner: Element | null = null;
	for (let current: Element | null = element; current && current !== view.dom; ) {
		if (
			isBlockElement(current) &&
			!current.contains(pointerTarget) &&
			// Layout columns have a top hover strip instead of a left gutter.
			current.getAttribute('data-prosemirror-node-name') !== 'layoutColumn'
		) {
			owner = current;
		}
		current = current.parentElement;
	}
	return owner;
};

const findBlockBesidePointer = (
	view: EditorView,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	event: MouseEvent,
	pointerTarget: Element,
	widths: GutterWidths,
): Element | null => {
	const pointerBlock = pointerTarget.closest(BLOCK_SELECTOR);
	const gutterWidth =
		pointerBlock && view.dom.contains(pointerBlock)
			? DRAG_HANDLE_MAX_WIDTH_PLUS_GAP
			: getTopLevelGutterWidth(api, widths);
	const sample = getEditorElementAt(view, event.clientX + gutterWidth, event.clientY);
	const owner = sample && findGutterOwner(view, sample, pointerTarget);
	if (!owner) {
		return null;
	}
	const left = getVisibleLeft(owner);
	return event.clientX < left && left - event.clientX <= gutterWidth ? owner : null;
};

const findColumnBelowPointer = (
	view: EditorView,
	event: MouseEvent,
	pointerTarget: Element,
): Element | null => {
	if (
		pointerTarget.closest(LAYOUT_COLUMN_SELECTOR) ||
		(pointerTarget !== view.dom && !pointerTarget.closest(LAYOUT_SECTION_SELECTOR))
	) {
		return null;
	}
	const sample = getEditorElementAt(view, event.clientX, event.clientY + LAYOUT_COLUMN_STRIP_REACH);
	const column = sample?.closest(LAYOUT_COLUMN_SELECTOR);
	return column && view.dom.contains(column) && event.clientY < column.getBoundingClientRect().top
		? column
		: null;
};

/** Returns a function that finds the block whose legacy hover zone contains the pointer. */
export const createGutterBlockFinder = (
	view: EditorView,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
): ((event: MouseEvent) => Element | null) => {
	const widths = getGutterWidths();
	return (event) => {
		if (!(event.target instanceof Element)) {
			return null;
		}
		return (
			findBlockBesidePointer(view, api, event, event.target, widths) ??
			(view.dom.contains(event.target) ? findColumnBelowPointer(view, event, event.target) : null)
		);
	};
};

/** The latest gutter event waiting to be handled after the frame renders. */
type PendingPointer = {
	event: MouseEvent;
	/**
	 * Whether the pointer reached a new element since the last handled event. Kept separately because
	 * a later mousemove in the same frame replaces the mouseover as `event`.
	 */
	reachedNewElement: boolean;
};

/** What gutter hover does with a pointer position. */
type GutterHover =
	/** The pointer is in a block's gutter: show that block's controls. */
	| { element: Element; kind: 'block' }
	/**
	 * The pointer just reached part of a container that is not beside a nested block, e.g. a panel's
	 * icon: show the container's controls.
	 */
	| { element: Element; kind: 'container' }
	/**
	 * Anything else, e.g. moving on through the margin between two nested blocks: keep the current
	 * controls instead of flickering to the container.
	 */
	| { kind: 'none' };

/**
 * Leaving block controls does not count as reaching a new element: a nested block's drag handle
 * overhangs the block, so leaving the handle can put the pointer on the container with no block
 * beside it, and that exit must keep the controls on the block.
 */
const isLeavingBlockControls = (event: MouseEvent): boolean =>
	event.relatedTarget instanceof Element &&
	Boolean(event.relatedTarget.closest(BLOCK_CONTROLS_SURFACE_SELECTOR));

const classifyGutterHover = (
	view: EditorView,
	findGutterBlock: (event: MouseEvent) => Element | null,
	{ event, reachedNewElement }: PendingPointer,
): GutterHover => {
	const block = findGutterBlock(event);
	if (block) {
		return { kind: 'block', element: block };
	}
	const hoveredElement = event.target;
	if (reachedNewElement && hoveredElement instanceof Element && view.dom.contains(hoveredElement)) {
		return { kind: 'container', element: hoveredElement };
	}
	return { kind: 'none' };
};

/**
 * Runs `callback` once after the next frame renders (`requestAnimationFrame`, then `setTimeout`).
 * Layout is clean then, so reading positions never forces a synchronous layout. Calls made while a
 * run is already scheduled are ignored.
 */
const createAfterRenderScheduler = (win: Window, callback: () => void) => {
	let frame: number | undefined;
	let timeout: number | undefined;
	return {
		schedule: () => {
			if (frame !== undefined || timeout !== undefined) {
				return;
			}
			frame = win.requestAnimationFrame(() => {
				frame = undefined;
				timeout = win.setTimeout(() => {
					timeout = undefined;
					callback();
				}, 0);
			});
		},
		cancel: () => {
			if (frame !== undefined) {
				win.cancelAnimationFrame(frame);
				frame = undefined;
			}
			if (timeout !== undefined) {
				win.clearTimeout(timeout);
				timeout = undefined;
			}
		},
	};
};

/**
 * Keeps interaction tracking in step with gutter hover, as the legacy hover zones did. They sat
 * inside the block tree, so hovering one cleared the typing state, counted as inside the editor even
 * where the zone reached past the content area, and put the pointer on the left side of the
 * right-side controls split.
 */
const createInteractionTrackingSync = (
	view: EditorView,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	contentArea: Element | null,
) => {
	// Set after gutter hover calls mouseEnter for a gutter outside the content area, so that leaving
	// that gutter calls mouseLeave.
	let isHoldingMouseEnter = false;

	return (event: MouseEvent, isOverGutter: boolean) => {
		const state = getInteractionTrackingState(view.state);
		const rightSideControlsEnabled =
			api?.blockControls.sharedState.currentState()?.rightSideControlsEnabled;
		const side = rightSideControlsEnabled ? 'left' : undefined;

		if (isOverGutter && state?.isEditing) {
			stopEditing(view);
		}

		if (event.target instanceof Node && contentArea?.contains(event.target)) {
			isHoldingMouseEnter = false;
		} else if (isOverGutter && state?.isMouseOut) {
			isHoldingMouseEnter = true;
			mouseEnter(view, side);
			return;
		} else if (!isOverGutter && isHoldingMouseEnter) {
			isHoldingMouseEnter = false;
			handleMouseLeave(view, rightSideControlsEnabled);
			return;
		}

		if (isOverGutter && side && state?.hoverSide !== side) {
			setHoverSide(view, side);
		}
	};
};

/**
 * Shows block controls for the block the pointer hovers under sparse surfaces, including the empty
 * space to a block's left (the gutter). This is the only hover handler for sparse surfaces.
 *
 * Reaching text or a leaf block shows its controls straight away. Over an element that can be part
 * of a gutter, only the latest pointer event is kept, and it is resolved once after the frame
 * renders so that reading positions never forces a layout.
 *
 * Returns an unbind function, or `undefined` when the editor's document has no window.
 */
export const bindSparseGutterHover = ({
	api,
	view,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	view: EditorView;
}): (() => void) | undefined => {
	const win = view.dom.ownerDocument.defaultView;
	if (!win) {
		return undefined;
	}
	const contentArea = view.dom.closest('.ak-editor-content-area');
	// A wide block's gutter can sit outside the padded content area. Editors without a scroll
	// container or content area still get hover, over as much of the gutter as their wrapper covers.
	const eventArea =
		view.dom.closest('[data-editor-scroll-container="true"]') ??
		contentArea ??
		view.dom.parentElement ??
		view.dom;

	const findGutterBlock = createGutterBlockFinder(view, api);
	const syncInteractionTracking = createInteractionTrackingSync(view, api, contentArea);
	let pending: PendingPointer | undefined;

	const handlePendingPointer = () => {
		const pointer = pending;
		pending = undefined;
		if (!pointer || isSparseHoverSuppressed(view, api)) {
			return;
		}
		const hover = classifyGutterHover(view, findGutterBlock, pointer);
		if (hover.kind !== 'none') {
			handleSparseHoverTarget(view, hover.element, api);
		}
		syncInteractionTracking(pointer.event, hover.kind === 'block');
	};
	const scheduler = createAfterRenderScheduler(win, handlePendingPointer);

	const queueGutterEvent = (event: MouseEvent, reachedNewElement: boolean) => {
		pending = {
			event,
			reachedNewElement: Boolean(pending?.reachedNewElement) || reachedNewElement,
		};
		scheduler.schedule();
	};

	// Classified on every mouseover and reused while the pointer moves within that element, so
	// movement over text costs one comparison.
	let hovered: { element: EventTarget | null; isPossibleGutter: boolean } | undefined;
	const classifyHoveredElement = (element: EventTarget | null): boolean => {
		hovered = { element, isPossibleGutter: isPossibleGutterElement(view, element) };
		return hovered.isPossibleGutter;
	};

	const onMouseOver = (event: MouseEvent) => {
		if (classifyHoveredElement(event.target)) {
			queueGutterEvent(event, !isLeavingBlockControls(event));
			return;
		}
		pending = undefined;
		const hoveredElement = event.target;
		if (
			hoveredElement instanceof Element &&
			view.dom.contains(hoveredElement) &&
			!isSparseHoverSuppressed(view, api)
		) {
			handleSparseHoverTarget(view, hoveredElement, api);
		}
	};

	const onMouseMove = (event: MouseEvent) => {
		const isPossibleGutter =
			hovered?.element === event.target
				? hovered.isPossibleGutter
				: classifyHoveredElement(event.target);
		if (isPossibleGutter) {
			queueGutterEvent(event, false);
		}
	};

	const bindMouseListener = (
		type: 'mousemove' | 'mouseover',
		listener: (event: MouseEvent) => void,
	) =>
		bind(eventArea, {
			type,
			listener: (event: Event) => {
				if (event instanceof win.MouseEvent) {
					listener(event);
				}
			},
			options: { passive: true },
		});
	const unbindMouseOver = bindMouseListener('mouseover', onMouseOver);
	const unbindMouseMove = bindMouseListener('mousemove', onMouseMove);

	return () => {
		unbindMouseOver();
		unbindMouseMove();
		scheduler.cancel();
		pending = undefined;
	};
};
