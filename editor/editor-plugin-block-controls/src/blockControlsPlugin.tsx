import React from 'react';

import { expandSelectionBounds } from '@atlaskit/editor-common/selection';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type { DIRECTION, PMPlugin } from '@atlaskit/editor-common/types';
import {
	TextSelection,
	type EditorState,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { type Mapping } from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	BlockControlsPlugin,
	BlockControlsSharedState,
	HandleOptions,
	MultiSelectDnD,
	NodeDecorationFactory,
	TriggerByNode,
} from './blockControlsPluginType';
import { handleKeyDownWithPreservedSelection } from './editor-commands/handle-key-down-with-preserved-selection';
import { mapPreservedSelection } from './editor-commands/map-preserved-selection';
import { moveNode } from './editor-commands/move-node';
import { moveNodeWithBlockMenu } from './editor-commands/move-node-with-block-menu';
import { moveToLayout } from './editor-commands/move-to-layout';
import { canMoveNodeUpOrDown } from './editor-commands/utils/move-node-utils';
import { firstNodeDecPlugin } from './pm-plugins/first-node-dec-plugin';
import {
	createInteractionTrackingPlugin,
	interactionTrackingPluginKey,
} from './pm-plugins/interaction-tracking/pm-plugin';
import { createPlugin, key } from './pm-plugins/main';
import {
	startPreservingSelection,
	stopPreservingSelection,
} from './pm-plugins/selection-preservation/editor-commands';
import { selectionPreservationPluginKey } from './pm-plugins/selection-preservation/plugin-key';
import { createSelectionPreservationPlugin } from './pm-plugins/selection-preservation/pm-plugin';
import { selectNode } from './pm-plugins/utils/getSelection';
import { GlobalStylesWrapper } from './ui/global-styles';

export const blockControlsPlugin: BlockControlsPlugin = ({ api }) => {
	const nodeDecorationRegistry: NodeDecorationFactory[] = [];

	return {
		name: 'blockControls',

		actions: {
			registerNodeDecoration: (factory: NodeDecorationFactory) => {
				nodeDecorationRegistry.push(factory);
			},
			unregisterNodeDecoration: (type: string) => {
				const idx = nodeDecorationRegistry.findIndex((f) => f.type === type);
				if (idx !== -1) {
					nodeDecorationRegistry.splice(idx, 1);
				}
			},
		},

		pmPlugins() {
			const pmPlugins: PMPlugin[] = [
				{
					name: 'blockControlsPmPlugin',
					plugin: ({ getIntl, nodeViewPortalProviderAPI }) =>
						createPlugin(api, getIntl, nodeViewPortalProviderAPI, nodeDecorationRegistry),
				},
			];

			if (editorExperiment('platform_editor_controls', 'variant1')) {
				pmPlugins.push({
					name: 'blockControlsInteractionTrackingPlugin',
					plugin: createInteractionTrackingPlugin,
				});
			}

			if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
				pmPlugins.push({
					name: 'blockControlsSelectionPreservationPlugin',
					plugin: createSelectionPreservationPlugin(api),
				});
			}

			// platform_editor_controls note: quick insert rendering fixes
			if (areToolbarFlagsEnabled(Boolean(api?.toolbar))) {
				pmPlugins.push({
					name: 'firstNodeDec',
					plugin: firstNodeDecPlugin,
				});
			}

			return pmPlugins;
		},

		commands: {
			moveNode: moveNode(api),
			moveToLayout: moveToLayout(api),
			showDragHandleAt:
				(
					pos: number,
					anchorName: string,
					nodeType: string,
					handleOptions?: HandleOptions,
					rootPos?: number,
					rootAnchorName?: string,
					rootNodeType?: string,
				) =>
				({ tr }: { tr: Transaction }) => {
					const currMeta = tr.getMeta(key);

					tr.setMeta(key, {
						...currMeta,
						activeNode: {
							pos,
							anchorName,
							nodeType,
							handleOptions,
							rootPos,
							rootAnchorName,
							rootNodeType,
						},
					});
					return tr;
				},
			toggleBlockMenu:
				(options?: {
					anchorName?: string;
					closeMenu?: boolean;
					openedViaKeyboard?: boolean;
					triggerByNode?: TriggerByNode;
				}) =>
				({ tr }: { tr: Transaction }) => {
					if (!expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
						return tr;
					}

					const currMeta = tr.getMeta(key);
					const currentUserIntent = api?.userIntent?.sharedState.currentState()?.currentUserIntent;
					const isMenuCurrentlyOpen = api?.blockControls?.sharedState.currentState()?.isMenuOpen;

					if (options?.closeMenu) {
						tr.setMeta(key, { ...currMeta, closeMenu: true });
						if (currentUserIntent === 'blockMenuOpen') {
							api?.userIntent?.commands.setCurrentUserIntent('default')({ tr });
						}

						// When closing the menu, restart the active session timer
						if (isMenuCurrentlyOpen && fg('platform_editor_ease_of_use_metrics')) {
							api?.metrics?.commands.startActiveSessionTimer()({ tr });
						}

						return tr;
					}

					// Do not open menu on layoutColumn and close opened menu when layoutColumn drag handle is clicked
					if (options?.anchorName?.includes('layoutColumn')) {
						if (currentUserIntent === 'blockMenuOpen') {
							api?.userIntent?.commands.setCurrentUserIntent('default')({ tr });
						}
						tr.setMeta(key, { ...currMeta, closeMenu: true });

						// When closing the menu, restart the active session timer
						if (isMenuCurrentlyOpen && fg('platform_editor_ease_of_use_metrics')) {
							api?.metrics?.commands.startActiveSessionTimer()({ tr });
						}

						return tr;
					}

					let toggleMenuMeta: {
						anchorName?: string;
						moveDown?: boolean;
						moveUp?: boolean;
						openedViaKeyboard?: boolean;
						triggerByNode?: TriggerByNode;
					} = {
						anchorName: options?.anchorName,
						triggerByNode: options?.triggerByNode,
					};
					const menuTriggerBy = api?.blockControls?.sharedState.currentState()?.menuTriggerBy;
					if (options?.anchorName) {
						const { moveUp, moveDown } = canMoveNodeUpOrDown(tr);
						toggleMenuMeta = {
							...toggleMenuMeta,
							moveUp,
							moveDown,
							openedViaKeyboard: options?.openedViaKeyboard,
						};
					}
					tr.setMeta(key, {
						...currMeta,
						toggleMenu: toggleMenuMeta,
					});

					if (
						(menuTriggerBy === undefined ||
							(!!menuTriggerBy && menuTriggerBy === options?.anchorName)) &&
						currentUserIntent === 'blockMenuOpen'
					) {
						const state = api?.blockControls.sharedState.currentState();
						if (state?.isSelectedViaDragHandle) {
							api?.userIntent?.commands.setCurrentUserIntent('dragHandleSelected')({ tr });
						} else {
							// Toggled from drag handle
							api?.userIntent?.commands.setCurrentUserIntent('default')({ tr });
						}

						// When closing the menu, restart the active session timer
						if (fg('platform_editor_ease_of_use_metrics')) {
							api?.metrics?.commands.startActiveSessionTimer()({ tr });
						}
					} else if (!isMenuCurrentlyOpen) {
						// When opening the menu, pause the active session timer
						if (fg('platform_editor_ease_of_use_metrics')) {
							api?.metrics?.commands.handleIntentToStartEdit({
								shouldStartTimer: false,
								shouldPersistActiveSession: true,
							})({ tr });
						}
					}

					return tr;
				},

			setNodeDragged:
				(getPos: () => number | undefined, anchorName: string, nodeType: string) =>
				({ tr }: { tr: Transaction }) => {
					const pos = getPos();
					if (pos === undefined) {
						return tr;
					}

					const currMeta = tr.getMeta(key);
					tr.setMeta(key, {
						...currMeta,
						isDragging: true,
						activeNode: { pos, anchorName, nodeType },
					});

					if (fg('platform_editor_ease_of_use_metrics')) {
						api?.metrics?.commands.handleIntentToStartEdit({
							shouldStartTimer: false,
							shouldPersistActiveSession: true,
						})({ tr });
					}
					api?.userIntent?.commands.setCurrentUserIntent('dragging')({ tr });

					return tr;
				},
			setMultiSelectPositions:
				(anchor?: number, head?: number) =>
				({ tr }: { tr: Transaction }) => {
					const { anchor: userAnchor, head: userHead } = tr.selection;
					let $expandedAnchor, $expandedHead;

					if (anchor !== undefined && head !== undefined) {
						$expandedAnchor = tr.doc.resolve(anchor);
						$expandedHead = tr.doc.resolve(head);
					} else {
						const expandedSelection = expandSelectionBounds(
							tr.selection.$anchor,
							tr.selection.$head,
						);
						$expandedAnchor = expandedSelection.$anchor;
						$expandedHead = expandedSelection.$head;
					}

					api?.selection?.commands.setManualSelection(
						$expandedAnchor.pos,
						$expandedHead.pos,
					)({ tr });

					const $from = $expandedAnchor.min($expandedHead);
					const $to = $expandedAnchor.max($expandedHead);
					let expandedNormalisedSel;
					if ($from.nodeAfter === $to.nodeBefore) {
						selectNode(tr, $from.pos, $expandedAnchor.node().type.name, api);
						expandedNormalisedSel = tr.selection;
					} else if (
						$to.nodeBefore?.type.name === 'mediaSingle' ||
						$from.nodeAfter?.type.name === 'mediaSingle'
					) {
						expandedNormalisedSel = new TextSelection($expandedAnchor, $expandedHead);
						tr.setSelection(expandedNormalisedSel);
					} else {
						// this is to normalise the selection's boundaries to inline positions, preventing it from collapsing
						expandedNormalisedSel = TextSelection.between($expandedAnchor, $expandedHead);
						tr.setSelection(expandedNormalisedSel);
					}
					const multiSelectDnD: MultiSelectDnD = {
						anchor: $expandedAnchor.pos,
						head: $expandedHead.pos,
						textAnchor: expandedNormalisedSel.anchor,
						textHead: expandedNormalisedSel.head,
						userAnchor: userAnchor,
						userHead: userHead,
					};
					const currMeta = tr.getMeta(key);
					tr.setMeta(key, {
						...currMeta,
						multiSelectDnD,
					});
					return tr;
				},
			setSelectedViaDragHandle:
				(isSelectedViaDragHandle?: boolean) =>
				({ tr }: { tr: Transaction }) => {
					const currMeta = tr.getMeta(key);
					return tr.setMeta(key, { ...currMeta, isSelectedViaDragHandle });
				},
			mapPreservedSelection: (mapping: Mapping) => mapPreservedSelection(mapping),
			moveNodeWithBlockMenu: (direction: DIRECTION.UP | DIRECTION.DOWN) =>
				moveNodeWithBlockMenu(api, direction),
			handleKeyDownWithPreservedSelection: handleKeyDownWithPreservedSelection(api),
			startPreservingSelection: () => startPreservingSelection,
			stopPreservingSelection: () => stopPreservingSelection,
		},

		getSharedState(editorState: EditorState | undefined) {
			if (!editorState) {
				return undefined;
			}

			const sharedState: BlockControlsSharedState = {
				isMenuOpen: key.getState(editorState)?.isMenuOpen ?? false,
				menuTriggerBy: key.getState(editorState)?.menuTriggerBy ?? undefined,
				menuTriggerByNode: key.getState(editorState)?.menuTriggerByNode ?? undefined,
				blockMenuOptions: key.getState(editorState)?.blockMenuOptions ?? undefined,
				activeNode: key.getState(editorState)?.activeNode ?? undefined,
				activeDropTargetNode: key.getState(editorState)?.activeDropTargetNode ?? undefined,
				isDragging: key.getState(editorState)?.isDragging ?? false,
				isPMDragging: key.getState(editorState)?.isPMDragging ?? false,
				multiSelectDnD: key.getState(editorState)?.multiSelectDnD ?? undefined,
				isShiftDown: key.getState(editorState)?.isShiftDown ?? undefined,
				lastDragCancelled: key.getState(editorState)?.lastDragCancelled ?? false,
				isEditing: interactionTrackingPluginKey.getState(editorState)?.isEditing,
				isSelectedViaDragHandle: key.getState(editorState)?.isSelectedViaDragHandle ?? false,
			};

			if (editorExperiment('platform_editor_controls', 'variant1')) {
				sharedState.isMouseOut =
					interactionTrackingPluginKey.getState(editorState)?.isMouseOut ?? false;
			}

			if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
				sharedState.preservedSelection =
					selectionPreservationPluginKey.getState(editorState)?.preservedSelection;
			}

			return sharedState;
		},

		contentComponent() {
			return <GlobalStylesWrapper api={api} />;
		},
	};
};
