import React from 'react';

import { expandSelectionBounds } from '@atlaskit/editor-common/selection';
import type { PMPlugin } from '@atlaskit/editor-common/types';
import {
	TextSelection,
	type EditorState,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	BlockControlsPlugin,
	BlockControlsSharedState,
	HandleOptions,
	MultiSelectDnD,
} from './blockControlsPluginType';
import { moveNode } from './editor-commands/move-node';
import { moveToLayout } from './editor-commands/move-to-layout';
import { firstNodeDecPlugin } from './pm-plugins/first-node-dec-plugin';
import {
	createInteractionTrackingPlugin,
	interactionTrackingPluginKey,
} from './pm-plugins/interaction-tracking/pm-plugin';
import { createPlugin, key } from './pm-plugins/main';
import { selectNode } from './pm-plugins/utils/getSelection';
import BlockMenu from './ui/block-menu';
import { DragHandleMenu } from './ui/drag-handle-menu';
import { GlobalStylesWrapper } from './ui/global-styles';

export const blockControlsPlugin: BlockControlsPlugin = ({ api }) => ({
	name: 'blockControls',

	pmPlugins() {
		const pmPlugins: PMPlugin[] = [
			{
				name: 'blockControlsPmPlugin',
				plugin: ({ getIntl, nodeViewPortalProviderAPI }) =>
					createPlugin(api, getIntl, nodeViewPortalProviderAPI),
			},
		];

		if (editorExperiment('platform_editor_controls', 'variant1')) {
			pmPlugins.push({
				name: 'blockControlsInteractionTrackingPlugin',
				plugin: createInteractionTrackingPlugin,
			});
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
					closeMenu: editorExperiment('platform_editor_controls', 'variant1') ? true : undefined,
				});
				return tr;
			},
		toggleBlockMenu:
			(options?: { closeMenu?: boolean; anchorName?: string }) =>
			({ tr }: { tr: Transaction }) => {
				const currMeta = tr.getMeta(key);
				if (options?.closeMenu) {
					tr.setMeta(key, { ...currMeta, closeMenu: true });
					return tr;
				}
				tr.setMeta(key, { ...currMeta, toggleMenu: { anchorName: options?.anchorName } });
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
					const expandedSelection = expandSelectionBounds(tr.selection.$anchor, tr.selection.$head);
					$expandedAnchor = expandedSelection.$anchor;
					$expandedHead = expandedSelection.$head;
				}

				api?.selection?.commands.setManualSelection($expandedAnchor.pos, $expandedHead.pos)({ tr });

				const $from = $expandedAnchor.min($expandedHead);
				const $to = $expandedAnchor.max($expandedHead);
				let expandedNormalisedSel;
				if ($from.nodeAfter === $to.nodeBefore) {
					selectNode(tr, $from.pos, $expandedAnchor.node().type.name);
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
	},

	getSharedState(editorState: EditorState | undefined) {
		if (!editorState) {
			return undefined;
		}

		const sharedState: BlockControlsSharedState = {
			isMenuOpen: key.getState(editorState)?.isMenuOpen ?? false,
			menuTriggerBy: key.getState(editorState)?.menuTriggerBy ?? undefined,
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

		return sharedState;
	},

	contentComponent({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
	}) {
		return (
			<>
				{editorExperiment('platform_editor_controls', 'variant1') ? (
					<BlockMenu
						editorView={editorView}
						mountPoint={popupsMountPoint}
						boundariesElement={popupsBoundariesElement}
						scrollableElement={popupsScrollableElement}
						api={api}
					/>
				) : (
					<DragHandleMenu api={api} />
				)}
				<GlobalStylesWrapper api={api} />
			</>
		);
	},
});
