import { bind } from 'bind-event-listener';
import type { UnbindFn } from 'bind-event-listener';

import { isBlockControlsSuppressionTarget } from '@atlaskit/editor-common/block-controls-suppression';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';
import { RIGHT_MARGIN_ROVO_GAP_PX } from './constants';
import { handleKeyDown } from './handle-key-down';
import { handleMouseEnter, handleMouseLeave, handleMouseMove } from './handle-mouse-move';

/** Elements that extend the editor hover area (block controls, right-edge button, etc.) */
const LEGACY_BLOCK_CONTROLS_HOVER_AREA_SELECTOR =
	'[data-blocks-right-edge-button-container], [data-blocks-drag-handle-container], [data-testid="block-ctrl-drag-handle"], [data-testid="block-ctrl-drag-handle-container"], [data-testid="block-ctrl-decorator-widget"], [data-testid="block-ctrl-quick-insert-button"]';

const getBlockControlsHoverAreaSelector = (): string =>
	isExperimentEnabled('platform_editor_block_control_migration')
		? `[data-editor-block-controls-surface], [data-editor-block-ctrl-drag-handle], ${LEGACY_BLOCK_CONTROLS_HOVER_AREA_SELECTOR}`
		: LEGACY_BLOCK_CONTROLS_HOVER_AREA_SELECTOR;

const MOUSE_LEAVE_DEBOUNCE_MS = 200;

/** ClickAreaBlock overlay that wraps the editor content and covers the right margin. */
const CLICK_AREA_SELECTOR = '[data-editor-click-wrapper]';

const isMovingToBlockControlsArea = (target: EventTarget | null): boolean =>
	target instanceof Element && !!target.closest(getBlockControlsHoverAreaSelector());

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

const isOverTreatmentClickArea = (
	target: EventTarget | null,
	editorContentArea: Element | null,
	clientX: number,
): boolean => {
	if (!(target instanceof Element) || !(editorContentArea instanceof HTMLElement)) {
		return false;
	}
	if (!target.closest(CLICK_AREA_SELECTOR)) {
		return false;
	}
	return clientX > editorContentArea.getBoundingClientRect().right;
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
	side?: 'left' | 'right';
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
						if (meta.side) {
							newState.hoverSide = meta.side;
						}
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

					const scheduleMouseLeave = (event: MouseEvent) => {
						if (mouseLeaveTimeoutId) {
							clearTimeout(mouseLeaveTimeoutId);
							mouseLeaveTimeoutId = null;
						}

						// Preserve the existing hover targets for the control cohort.
						if (
							rightSideControlsEnabled &&
							(isMovingToBlockControlsArea(event.relatedTarget) ||
								isOverActiveClickArea(event.relatedTarget, event.clientX))
						) {
							return;
						}
						if (
							rightSideControlsEnabled &&
							isExperimentEnabled('cc_maui_remix_button_hover_corridor') &&
							isOverTreatmentClickArea(event.relatedTarget, editorContentArea, event.clientX)
						) {
							return;
						}

						mouseLeaveTimeoutId = setTimeout(() => {
							mouseLeaveTimeoutId = null;
							// Re-check the control cohort's existing hover targets after the debounce.
							if (rightSideControlsEnabled && typeof document !== 'undefined') {
								const el = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
								if (
									el &&
									(isMovingToBlockControlsArea(el) ||
										isOverActiveClickArea(el, lastMousePosition.x))
								) {
									return;
								}
								if (
									el &&
									isExperimentEnabled('cc_maui_remix_button_hover_corridor') &&
									isOverTreatmentClickArea(el, editorContentArea, lastMousePosition.x)
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

					const handleDocumentMouseMove = (event: MouseEvent) => {
						lastMousePosition = { x: event.clientX, y: event.clientY };
						// Catches block controls in portals that handleDOMEvents.mousemove misses.
						const isOverKnownHoverTarget =
							editorContentArea?.contains(event.target as Node) ||
							isMovingToBlockControlsArea(event.target);
						const overClickArea =
							event.target instanceof Element && !!event.target.closest(CLICK_AREA_SELECTOR);
						if (isOverKnownHoverTarget || overClickArea) {
							handleMouseMove(view, event, rightSideControlsEnabled, api);
						}
					};

					const handleTreatmentDocumentMouseMove = (event: MouseEvent) => {
						if (isBlockControlsSuppressionTarget(event.target)) {
							lastMousePosition = { x: event.clientX, y: event.clientY };
							cancelScheduledMouseLeave();
							if (!interactionTrackingPluginKey.getState(view.state)?.isMouseOut) {
								handleMouseLeave(view, rightSideControlsEnabled);
							}
							return;
						}
						handleDocumentMouseMove(event);
					};

					if (editorContentArea) {
						if (rightSideControlsEnabled && typeof document !== 'undefined') {
							// RemixButtonDecoration fires exposure when the control is visible; this
							// mount-time split only selects the appropriate interaction listener.
							if (
								UNSAFE_expValNoExposure(
									'cc_maui_remix_button_hover_corridor',
									'isEnabled',
									false,
								) === true
							) {
								unbindDocumentMouseMove = bind(document, {
									type: 'mousemove',
									listener: handleTreatmentDocumentMouseMove,
									options: { passive: true },
								});
							} else {
								unbindDocumentMouseMove = bind(document, {
									type: 'mousemove',
									listener: handleDocumentMouseMove,
									options: { passive: true },
								});
							}
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
