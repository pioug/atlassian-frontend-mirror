import { bind, type UnbindFn } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { handleKeyDown } from './handle-key-down';
import { handleMouseEnter, handleMouseLeave, handleMouseMove } from './handle-mouse-move';

/** Elements that extend the editor hover area (block controls, right-edge button, etc.) */
const BLOCK_CONTROLS_HOVER_AREA_SELECTOR =
	'[data-blocks-right-edge-button-container], [data-blocks-drag-handle-container], [data-testid="block-ctrl-drag-handle"], [data-testid="block-ctrl-drag-handle-container"], [data-testid="block-ctrl-decorator-widget"], [data-testid="block-ctrl-quick-insert-button"]';

const MOUSE_LEAVE_DEBOUNCE_MS = 200;

const isMovingToBlockControlsArea = (target: EventTarget | null): boolean =>
	target instanceof Element && !!target.closest(BLOCK_CONTROLS_HOVER_AREA_SELECTOR);

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
					handleMouseMove(view, event, rightSideControlsEnabled),
			},
		},

		view: editorExperiment('platform_editor_controls', 'variant1')
			? (view: EditorView) => {
					const editorContentArea = view.dom.closest('.ak-editor-content-area');
					// rightSideControlsEnabled is the single source of truth (confluence_remix_icon_right_side from preset)

					let unbindMouseEnter: UnbindFn;
					let unbindMouseLeave: UnbindFn;
					let unbindDocumentMouseMove: UnbindFn | undefined;
					let mouseLeaveTimeoutId: ReturnType<typeof setTimeout> | null = null;
					let lastMousePosition = { x: 0, y: 0 };

					const scheduleMouseLeave = (event: MouseEvent) => {
						if (mouseLeaveTimeoutId) {
							clearTimeout(mouseLeaveTimeoutId);
							mouseLeaveTimeoutId = null;
						}

						// Don't set isMouseOut when moving to block controls (right-edge button, drag handle, etc.)
						if (rightSideControlsEnabled && isMovingToBlockControlsArea(event.relatedTarget)) {
							return;
						}

						mouseLeaveTimeoutId = setTimeout(() => {
							mouseLeaveTimeoutId = null;
							// Before dispatching, check if mouse has moved to block controls (e.g. through empty space)
							if (rightSideControlsEnabled && typeof document !== 'undefined') {
								const el = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
								if (el && isMovingToBlockControlsArea(el)) {
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
									// Use document-level mousemove so we get events when hovering over block
									// controls (which may be in portals outside the editor DOM). Without this,
									// handleDOMEvents.mousemove only fires when over the editor content.
									if (
										editorContentArea.contains(event.target as Node) ||
										isMovingToBlockControlsArea(event.target)
									) {
										handleMouseMove(view, event, rightSideControlsEnabled);
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
