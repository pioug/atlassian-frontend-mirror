import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	DELETE_DIRECTION,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import { isEmptySelectionAtEnd, walkNextNode } from '@atlaskit/editor-common/utils';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { calcJoinListScenario } from '../actions/join-list-items-forward';

export const joinListItemForward =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const {
			tr,
			selection: { $head },
		} = state;
		const walkNode = walkNextNode($head);

		if (!isEmptySelectionAtEnd(state)) {
			return false;
		}

		if (fg('platform_editor_blocks_patch_7')) {
			let interveningSyncBlockPos: number | undefined;
			// walkNextNode can skip leaf nodes because they have no resolvable content position.
			state.doc.nodesBetween($head.pos, walkNode.$pos.pos, (node, pos) => {
				if (interveningSyncBlockPos === undefined && node.type.name === 'syncBlock') {
					interveningSyncBlockPos = pos;
				}
				return interveningSyncBlockPos === undefined;
			});

			if (interveningSyncBlockPos !== undefined) {
				if (dispatch) {
					const selection = NodeSelection.create(state.doc, interveningSyncBlockPos);
					dispatch(tr.setSelection(selection).scrollIntoView());
				}
				return true;
			}
		}

		const scenarios = calcJoinListScenario(walkNode, $head);

		if (!scenarios) {
			return false;
		}
		const [scenario, action] = scenarios;

		const result = action({
			tr,
			$next: walkNode.$pos,
			$head: $head,
		});

		if (!result) {
			return false;
		}

		const { bulletList, orderedList } = state.schema.nodes;
		const listParent = findParentNodeOfType([bulletList, orderedList])(tr.selection);

		let actionSubjectId = ACTION_SUBJECT_ID.FORMAT_LIST_BULLET;
		if (listParent && listParent.node.type === orderedList) {
			actionSubjectId = ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
		}

		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.LIST_ITEM_JOINED,
			actionSubject: ACTION_SUBJECT.LIST,
			actionSubjectId,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				inputMethod: INPUT_METHOD.KEYBOARD,
				direction: DELETE_DIRECTION.FORWARD,
				scenario,
			},
		})(tr);

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
