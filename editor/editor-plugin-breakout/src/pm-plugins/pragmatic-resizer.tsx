import { bind } from 'bind-event-listener';
import type { IntlShape, MessageDescriptor } from 'react-intl';

import { messages } from '@atlaskit/editor-common/messages/breakout';
import {
	VANILLA_TOOLTIP_DEFAULT_CLASS,
	VanillaTooltip,
} from '@atlaskit/editor-common/vanilla-tooltip';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import type {
	BaseEventPayload,
	ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/internal-types';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/utils/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/utils/prevent-unhandled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

const getNodeName = (nodeName?: string) => {
	if (nodeName === 'layoutSection') {
		return 'layout';
	} else if (nodeName === 'codeBlock' || nodeName === 'expand') {
		return nodeName;
	} else if (
		(nodeName === 'rule' || nodeName === 'panel' || nodeName === 'panel_c1') &&
		expValEqualsNoExposure('platform_editor_lovability_resize_dividers_panels', 'isEnabled', true)
	) {
		return nodeName;
	} else if (
		(nodeName === 'extension' ||
			nodeName === 'bodiedExtension' ||
			nodeName === 'multiBodiedExtension') &&
		isExperimentEnabled('platform_editor_lovability_resize_extensions')
	) {
		return nodeName;
	} else {
		return 'node';
	}
};

/**
 * Read by `.pm-breakout-resize-tooltip-anchor`, declared in `editor-core`'s `resizerStyles.ts` and
 * its Compiled mirror. Rename in all three or the tooltip pins to the top of the rail.
 */
const tooltipAnchorTopVar = '--pm-breakout-resize-tooltip-anchor-top';

export const resizeHandleMessage: Record<string, MessageDescriptor> = {
	expand: messages.resizeExpand,
	codeBlock: messages.resizeCodeBlock,
	layout: messages.resizeLayout,
	rule: messages.resizeRule,
	panel: messages.resizePanel,
	panel_c1: messages.resizePanel,
	node: messages.resizeElement,
	extension: messages.resizeExtension,
	bodiedExtension: messages.resizeExtension,
	multiBodiedExtension: messages.resizeExtension,
};

/** Identifies the vanilla tooltip for tests and debugging. */
const TOOLTIP_CLASS_NAME = 'pm-breakout-resize-tooltip';

/**
 * Classes applied to the tooltip element: the shared default look, plus our own hook. The default
 * still reaches a `[popover]` because the tooltip is painted in the top layer but stays in the DOM
 * under `.ProseMirror`.
 */
const TOOLTIP_CLASS_NAMES = `${VANILLA_TOOLTIP_DEFAULT_CLASS} ${TOOLTIP_CLASS_NAME}`;

/**
 * Builds the resize handle's tooltip as plain DOM.
 *
 * Anchored to a point rather than to the rail, which spans the node's full height and would strand
 * the tooltip at the top of a tall node. This reproduces the ADS tooltip's `position="mouse"`,
 * which latches the cursor as the tooltip opens and does not move it afterwards — so no cursor
 * tracking is needed, just one style write per hover.
 */
const createHandleTooltip = ({
	anchor,
	intl,
	target,
}: {
	anchor: HTMLElement;
	intl: IntlShape;
	target: HTMLElement;
}): VanillaTooltip => {
	// Only correct once ProseMirror has populated `contentDOM`, so callers must build on first
	// hover — earlier reads fall back to the generic 'node' label.
	const node = target.querySelector<HTMLElement>('[data-prosemirror-node-name]');
	const nodeName = getNodeName(node?.dataset.prosemirrorNodeName);

	return new VanillaTooltip(
		anchor,
		intl.formatMessage(resizeHandleMessage[nodeName]),
		// Let the tooltip generate its own id.
		undefined,
		TOOLTIP_CLASS_NAMES,
		// Default delay, matching the ADS tooltip.
		300,
		// No inline styles
		undefined,
		// No `onShow`.
		undefined,
		// Below the cursor, matching the ADS tooltip's `position="mouse"`.
		'bottom',
	);
};

export const createPragmaticResizer = ({
	target,
	onDragStart,
	onDrag,
	onDrop,
	intl,
}: {
	intl: IntlShape;
	onDrag: (args: BaseEventPayload<ElementDragType>) => void;
	onDragStart: (args: BaseEventPayload<ElementDragType>) => void;
	onDrop: (args: BaseEventPayload<ElementDragType>) => void;
	target: HTMLElement;
}): {
	destroy: (isChangeToViewMode?: boolean) => void;
	leftHandle: HTMLDivElement | undefined;
	rightHandle: HTMLDivElement;
} => {
	let state: 'default' | 'resizing' = 'default';
	const isLeftResizeHandleDisabled =
		expValEquals('platform_editor_lovability_resize_dividers_panels', 'isEnabled', true) ||
		isExperimentEnabled('platform_editor_lovability_resize_extensions') ||
		isExperimentEnabled('platform_editor_remove_left_resize_handle');

	const createHandle = (side: 'left' | 'right') => {
		const handle = document.createElement('div');
		handle.contentEditable = 'false';
		handle.classList.add('pm-breakout-resize-handle-container');

		handle.style.gridColumn = side === 'left' ? '1' : '3';

		const rail = document.createElement('div');
		rail.classList.add('pm-breakout-resize-handle-rail');

		if (side === 'left') {
			handle.classList.add('pm-breakout-resize-handle-container--left');
			handle.setAttribute('data-testid', 'pragmatic-resizer-handle-left');
		} else {
			handle.classList.add('pm-breakout-resize-handle-container--right');
			handle.setAttribute('data-testid', 'pragmatic-resizer-handle-right');
		}

		const handleHitBox = document.createElement('div');
		handleHitBox.classList.add('pm-breakout-resize-handle-hit-box');

		const thumb = document.createElement('div');
		thumb.classList.add('pm-breakout-resize-handle-thumb');
		thumb.style.pointerEvents = 'none';

		rail.appendChild(thumb);

		// Marks the point the pointer entered the rail, and anchors the tooltip there: zero height
		// so it is a point not a box, full rail width so the tooltip centres on the cursor.
		//
		// Must stay a child of `rail` — `openTooltipAt` sets `top` from the rail's `offsetY`, which
		// only lines up while the rail is the containing block. jsdom cannot catch a wrong parent.
		//
		// Positioned by `.pm-breakout-resize-tooltip-anchor`; only the pointer's Y is passed in.
		const tooltipAnchor = document.createElement('div');
		tooltipAnchor.classList.add('pm-breakout-resize-tooltip-anchor');

		rail.appendChild(tooltipAnchor);

		const tooltipContainer = document.createElement('div');
		tooltipContainer.classList.add('pm-breakout-resize-handle-rail-wrapper');
		handle.appendChild(tooltipContainer);
		handle.appendChild(handleHitBox);

		let vanillaTooltip: VanillaTooltip | undefined;

		// Tracks whether there is anything to tear down: the tooltip mounts on first hover and so
		// may never mount at all.
		let isTooltipMounted = false;
		const mountTooltip = () => {
			if (isTooltipMounted) {
				return;
			}
			isTooltipMounted = true;

			vanillaTooltip = createHandleTooltip({ anchor: tooltipAnchor, target, intl });
		};

		// The tooltip is built on the first `mouseenter` of the node (see `registerEvents` below)
		// rather than up front, so a handle that is never hovered costs nothing. The rail has
		// `opacity: 0` until the pointer is inside the node, so the pre-mount DOM is never
		// visible, and the `mouseenter` fires on the whole node — long before the pointer reaches
		// the 7px handle.
		//
		// Parking the rail in the wrapper also needs `width: 100%`: without the ADS tooltip's
		// wrappers (stretched by `pragmaticResizerStylesForTooltip`) it would size to its content
		// as a flex item.
		rail.style.width = '100%';
		tooltipContainer.appendChild(rail);

		return {
			handle,
			rail,
			// Exposed so the rail's hover listeners can position and open the tooltip.
			tooltipAnchor,
			handleHitBox,
			mountTooltip,
			destroyTooltip: () => {
				// May never have mounted, as the tooltip is built on first hover.
				if (vanillaTooltip) {
					vanillaTooltip.destroy();
					vanillaTooltip = undefined;
				}
				isTooltipMounted = false;
			},
		};
	};

	const rightHandle = createHandle('right');
	// Remove const leftHandle during 'platform_editor_lovability_resize_dividers_panels' cleanup
	const leftHandle = isLeftResizeHandleDisabled ? undefined : createHandle('left');

	const registerHandle = (handleElement: HTMLElement, handleSide: 'left' | 'right') => {
		return draggable({
			element: handleElement,
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				disableNativeDragPreview({ nativeSetDragImage });
				preventUnhandled.start();
			},
			getInitialData: () => ({ handleSide }),
			onDragStart(args) {
				state = 'resizing';
				handleElement.classList.add('pm-breakout-resize-handle-container--active');

				// The tooltip has no pointer-press listener, and its anchor moves with the rail,
				// so it would follow the drag. Tearing it down hides it immediately; the next
				// hover rebuilds it.
				rightHandle.destroyTooltip();
				leftHandle?.destroyTooltip();

				onDragStart(args);
			},
			onDrag,
			onDrop(args) {
				preventUnhandled.stop();

				state = 'default';
				handleElement.classList.remove('pm-breakout-resize-handle-container--active');

				onDrop(args);
			},
		});
	};

	/**
	 * Parks the anchor where the pointer entered the rail, then opens the tooltip. The anchor is
	 * `pointer-events: none`, so the rail's hover listeners drive it. `offsetY` is already in the
	 * anchor's coordinate space, so no layout read is needed.
	 *
	 * Positions on enter only, matching the ADS tooltip as observed — though `Tooltip` does bind an
	 * `onMouseMove`, so start here if the two arms disagree on placement.
	 */
	const openTooltipAt = (anchor: HTMLElement | undefined, event: MouseEvent) => {
		// Only the rail bindings pass an anchor; `target` and the hit boxes do not.
		if (!anchor) {
			return;
		}

		anchor.style.setProperty(tooltipAnchorTopVar, `${event.offsetY}px`);
		anchor.dispatchEvent(new MouseEvent('mouseenter'));
	};

	const closeTooltip = (anchor: HTMLElement | undefined) => {
		if (!anchor) {
			return;
		}

		anchor.dispatchEvent(new MouseEvent('mouseleave'));
	};

	const registerEvents = (element: HTMLElement, hoverAnchor?: HTMLElement) => {
		return [
			bind(element, {
				type: 'mouseenter',
				listener: (event) => {
					// Mounted on first hover rather than up front, so a handle that is never
					// hovered costs nothing.
					rightHandle.mountTooltip();
					leftHandle?.mountTooltip();
					// After the mount above, so the tooltip always exists to be opened.
					openTooltipAt(hoverAnchor, event);
					rightHandle.rail.style.setProperty('opacity', '1');
					leftHandle?.rail.style.setProperty('opacity', '1');
				},
			}),
			bind(element, {
				type: 'mouseleave',
				listener: () => {
					// Ahead of the resize guard below: the tooltip hides whenever the pointer
					// leaves the rail, including part-way through a resize.
					closeTooltip(hoverAnchor);

					if (state === 'resizing') {
						return;
					}
					rightHandle.rail.style.removeProperty('opacity');
					leftHandle?.rail.style.removeProperty('opacity');
				},
			}),
		];
	};

	const unbindFns = leftHandle
		? // old code - left + right
			[
				...registerEvents(target),
				...registerEvents(rightHandle.handleHitBox),
				...registerEvents(leftHandle.handleHitBox),
				...registerEvents(rightHandle.rail, rightHandle.tooltipAnchor),
				...registerEvents(leftHandle.rail, leftHandle.tooltipAnchor),
			]
		: // new code - right only
			[
				...registerEvents(target),
				...registerEvents(rightHandle.handleHitBox),
				...registerEvents(rightHandle.rail, rightHandle.tooltipAnchor),
			];

	const handleElement = 'rail';

	const destroyFns = leftHandle
		? // old code - left + right
			[
				registerHandle(rightHandle[handleElement], 'right'),
				registerHandle(leftHandle[handleElement], 'left'),
				rightHandle.destroyTooltip,
				leftHandle.destroyTooltip,
			]
		: // new code - right only
			[registerHandle(rightHandle[handleElement], 'right'), rightHandle.destroyTooltip];

	return {
		rightHandle: rightHandle.handle,
		leftHandle: leftHandle?.handle,
		destroy: (isChangeToViewMode?: boolean): void => {
			destroyFns.forEach((destroyFn) => destroyFn());
			unbindFns.forEach((unbindFn) => unbindFn());

			if (isChangeToViewMode) {
				rightHandle.handle.parentElement?.removeChild(rightHandle.handle);
				leftHandle?.handle.parentElement?.removeChild(leftHandle.handle);
			}
		},
	};
};
