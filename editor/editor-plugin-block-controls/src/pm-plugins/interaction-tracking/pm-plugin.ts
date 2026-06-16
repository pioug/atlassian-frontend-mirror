import { bind } from 'bind-event-listener';
import type { UnbindFn } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';

import { RIGHT_MARGIN_ROVO_GAP_PX } from './constants';
import { handleKeyDown } from './handle-key-down';
import { handleMouseEnter, handleMouseLeave, handleMouseMove } from './handle-mouse-move';

/** Elements that extend the editor hover area (block controls, right-edge button, etc.) */
const BLOCK_CONTROLS_HOVER_AREA_SELECTOR =
	'[data-blocks-right-edge-button-container], [data-blocks-drag-handle-container], [data-testid="block-ctrl-drag-handle"], [data-testid="block-ctrl-drag-handle-container"], [data-testid="block-ctrl-decorator-widget"], [data-testid="block-ctrl-quick-insert-button"]';

const MOUSE_LEAVE_DEBOUNCE_MS = 200;

/** ClickAreaBlock overlay that wraps the editor content and covers the right margin. */
const CLICK_AREA_SELECTOR = '[data-editor-click-wrapper]';

const isMovingToBlockControlsArea = (target: EventTarget | null): boolean =>
	target instanceof Element && !!target.closest(BLOCK_CONTROLS_HOVER_AREA_SELECTOR);

/**
 * The right margin is covered by the ClickAreaBlock overlay, which sits outside .ak-editor-content-area.
 * Hovering there should still surface the right-side Remix button, so keep controls alive — but only on
 * the right (past the content's right edge), and not in the far-right Rovo gap. The left gutter must
 * dismiss like the experiment-off path, so it is treated as inactive.
 */
const isOverActiveClickArea = (target: EventTarget | null, clientX: number): boolean => {
	if (!(target instanceof Element)) {
		return false;
	}
	const clickArea = target.closest(CLICK_AREA_SELECTOR);
	if (!clickArea) {
		return false;
	}
	const contentRight = clickArea
		.querySelector('.ak-editor-content-area')
		?.getBoundingClientRect().right;
	if (contentRight !== undefined && clientX <= contentRight) {
		return false;
	}
	const innerWidth = target.ownerDocument.defaultView?.innerWidth ?? Number.POSITIVE_INFINITY;
	return clientX <= innerWidth - RIGHT_MARGIN_ROVO_GAP_PX;
};

export type InteractionTrackingPluginState = {
	/**
	 * Tracks which side of the editor the mouse is currently on.
	 */
	hoverSide?: 'left' | 'right';
	/**
	 * Tracks if a users intention is to edit the document (e.g. typing, deleting, etc.)
	 */
	isEditing: boolean;
	/**
	 * Tracks if the mouse is outside of the editor
	 */
	isMouseOut?: boolean;
};

export const interactionTrackingPluginKey: PluginKey<InteractionTrackingPluginState> =
	new PluginKey<InteractionTrackingPluginState>('interactionTrackingPlugin');

type StartEditingMeta = {
	type: 'startEditing';
};

type StopEditingMeta = {
	type: 'stopEditing';
};

type MouseLeaveMeta = {
	type: 'mouseLeave';
};

type MouseEnterMeta = {
	type: 'mouseEnter';
};

type SetHoverSideMeta = {
	side: 'left' | 'right';
	type: 'setHoverSide';
};

type ClearHoverSideMeta = {
	type: 'clearHoverSide';
};

type InteractionTrackingMeta =
	| StartEditingMeta
	| StopEditingMeta
	| MouseLeaveMeta
	| MouseEnterMeta
	| SetHoverSideMeta
	| ClearHoverSideMeta;

export const createInteractionTrackingPlugin = (
	rightSideControlsEnabled = false,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
): SafePlugin<InteractionTrackingPluginState> => {
	return new SafePlugin<InteractionTrackingPluginState>({
		key: interactionTrackingPluginKey,
		state: {
			init() {
				const state: InteractionTrackingPluginState = {
					isEditing: false,
				};

				if (editorExperiment('platform_editor_controls', 'variant1')) {
					state.isMouseOut = false;
				}

				return state;
			},

			apply(
				tr: ReadonlyTransaction,
				pluginState: InteractionTrackingPluginState,
			): InteractionTrackingPluginState {
				const meta = tr.getMeta(interactionTrackingPluginKey) as
					| InteractionTrackingMeta
					| undefined;

				const newState: Partial<InteractionTrackingPluginState> = {};
				switch (meta?.type) {
					case 'startEditing':
						newState.isEditing = true;
						break;
					case 'stopEditing':
						newState.isEditing = false;
						break;
					case 'mouseLeave':
						newState.isMouseOut = true;
						newState.hoverSide = undefined;
						break;
					case 'mouseEnter':
						newState.isMouseOut = false;
						break;
					case 'setHoverSide':
						newState.hoverSide = meta.side;
						break;
					case 'clearHoverSide':
						newState.hoverSide = undefined;
						break;
				}

				return { ...pluginState, ...newState };
			},
		},

		props: {
			handleKeyDown,
			handleDOMEvents: {
				mousemove: (view: EditorView, event: Event) =>
					handleMouseMove(view, event, rightSideControlsEnabled, api),
			},
		},

		view: editorExperiment('platform_editor_controls', 'variant1')
			? (view: EditorView) => {
					const editorContentArea = view.dom.closest('.ak-editor-content-area');
					// rightSideControlsEnabled is the single source of truth (confluence_remix_button_right_side_block_fg from preset)

					let unbindMouseEnter: UnbindFn;
					let unbindMouseLeave: UnbindFn;
					let unbindDocumentMouseMove: UnbindFn | undefined;
					let mouseLeaveTimeoutId: ReturnType<typeof setTimeout> | null = null;
					let lastMousePosition = { x: 0, y: 0 };

					// The active right margin only counts as "still hovering" when our experiment is on;
					// otherwise leaving the content area (e.g. exiting left) must dismiss as on master.
					const marginHoverEnabled = editorExperiment('remix_button_right_margin_hover', true);

					const scheduleMouseLeave = (event: MouseEvent) => {
						if (mouseLeaveTimeoutId) {
							clearTimeout(mouseLeaveTimeoutId);
							mouseLeaveTimeoutId = null;
						}

						// Keep controls visible when moving to block controls (or, with the experiment on,
						// the active right margin — the Rovo gap is excluded so controls still clear there).
						if (
							rightSideControlsEnabled &&
							(isMovingToBlockControlsArea(event.relatedTarget) ||
								(marginHoverEnabled &&
									isOverActiveClickArea(event.relatedTarget, event.clientX)))
						) {
							return;
						}

						mouseLeaveTimeoutId = setTimeout(() => {
							mouseLeaveTimeoutId = null;
							// Re-check after the debounce: keep controls if the cursor landed on block controls
							// (or, with the experiment on, the active right margin).
							if (rightSideControlsEnabled && typeof document !== 'undefined') {
								const el = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
								if (
									el &&
									(isMovingToBlockControlsArea(el) ||
										(marginHoverEnabled && isOverActiveClickArea(el, lastMousePosition.x)))
								) {
									return;
								}
							}
							handleMouseLeave(view, rightSideControlsEnabled);
						}, MOUSE_LEAVE_DEBOUNCE_MS);
					};

					const cancelScheduledMouseLeave = () => {
						if (mouseLeaveTimeoutId) {
							clearTimeout(mouseLeaveTimeoutId);
							mouseLeaveTimeoutId = null;
						}
					};

					if (editorContentArea) {
						if (rightSideControlsEnabled && typeof document !== 'undefined') {
							unbindDocumentMouseMove = bind(document, {
								type: 'mousemove',
								listener: (event: MouseEvent) => {
									lastMousePosition = { x: event.clientX, y: event.clientY };
									// Catches block controls in portals that handleDOMEvents.mousemove misses.
									// The right-margin overlay is only relevant with the experiment on.
									const overClickArea =
										marginHoverEnabled &&
										event.target instanceof Element &&
										!!event.target.closest(CLICK_AREA_SELECTOR);
									if (
										editorContentArea.contains(event.target as Node) ||
										isMovingToBlockControlsArea(event.target) ||
										overClickArea
									) {
										handleMouseMove(view, event, rightSideControlsEnabled, api);
									}
								},
								options: { passive: true },
							});
						}

						unbindMouseEnter = bind(editorContentArea, {
							type: 'mouseenter',
							listener: () => {
								if (rightSideControlsEnabled) {
									cancelScheduledMouseLeave();
								}
								handleMouseEnter(view);
							},
						});

						unbindMouseLeave = bind(editorContentArea, {
							type: 'mouseleave',
							listener: (event: Event) => {
								const e = event as MouseEvent;
								lastMousePosition = { x: e.clientX, y: e.clientY };
								if (rightSideControlsEnabled) {
									scheduleMouseLeave(e);
								} else {
									handleMouseLeave(view, false);
								}
							},
						});
					}

					return {
						destroy: () => {
							if (rightSideControlsEnabled) {
								cancelScheduledMouseLeave();
								unbindDocumentMouseMove?.();
							}
							unbindMouseEnter?.();
							unbindMouseLeave?.();
						},
					};
				}
			: undefined,
	});
};

export const getInteractionTrackingState = (
	state: EditorState,
): InteractionTrackingPluginState | undefined => {
	return interactionTrackingPluginKey.getState(state);
};
