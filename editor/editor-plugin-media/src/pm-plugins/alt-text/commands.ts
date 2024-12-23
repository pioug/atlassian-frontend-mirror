import type { EditorAnalyticsAPI, MediaAltTextActionType } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import {
	getMediaSingleOrInlineNodeFromSelection,
	isMediaSingleOrInlineNodeSelected,
} from '../../pm-plugins/utils/media-common';
import { getNodeType } from '../../ui/toolbar/commands';

import type { CloseMediaAltTextMenu, OpenMediaAltTextMenu, UpdateAltText } from './actions';

import { createCommand } from './index';

const createCommandWithAnalytics = (
	actionType: MediaAltTextActionType,
	action: (
		state: Readonly<EditorState>,
	) => false | OpenMediaAltTextMenu | CloseMediaAltTextMenu | UpdateAltText,
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => {
	return (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => {
		return withAnalytics(editorAnalyticsAPI, (state: EditorState) => {
			const mediaNode = getMediaSingleOrInlineNodeFromSelection(state);
			const type = getNodeType(state);
			return {
				action: actionType,
				actionSubject: ACTION_SUBJECT.MEDIA,
				actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					type,
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					mediaType: mediaNode!.attrs.type,
				},
			};
		})(createCommand(action, transform));
	};
};

// pass in undefined to close the alt text menu without saving
export const closeMediaAltTextMenuAndSave = (altText?: string) => {
	const commandTransform =
		typeof altText === 'string' ? updateAltTextTransform(altText) : undefined;
	return createCommand((state) => {
		if (isMediaSingleOrInlineNodeSelected(state)) {
			return { type: 'closeMediaAltTextMenu' };
		}
		return false;
	}, commandTransform);
};

export const closeMediaAltTextMenu = closeMediaAltTextMenuAndSave();

export const openMediaAltTextMenu = createCommandWithAnalytics(
	ACTION.OPENED,
	(state) => {
		if (isMediaSingleOrInlineNodeSelected(state)) {
			return { type: 'openMediaAltTextMenu' };
		}
		return false;
	},
	(tr: Transaction) => tr.setMeta('scrollIntoView', false),
);

const updateAltTextTransform =
	(newAltText: string) =>
	(tr: Transaction, state: EditorState): Transaction => {
		const mediaNode = getMediaSingleOrInlineNodeFromSelection(state);
		if (mediaNode) {
			// mediaSingle or mediaInline
			const originalSelectionPos = tr.selection.from;

			const mediaPos =
				mediaNode.type === state.schema.nodes.media
					? originalSelectionPos + 1 // media inside mediaSingle
					: originalSelectionPos; // mediaInline

			/**
			 * Any changes to attributes of a node count the node as "recreated" in Prosemirror[1]
			 * This makes it so Prosemirror resets the selection to the child i.e. "media" instead of "media-single"
			 * The recommended fix is to reset the selection.[2]
			 *
			 * [1] https://discuss.prosemirror.net/t/setnodemarkup-loses-current-nodeselection/976
			 * [2] https://discuss.prosemirror.net/t/setnodemarkup-and-deselect/3673
			 */
			tr.setMeta('scrollIntoView', false)
				.setNodeMarkup(mediaPos, undefined, {
					...mediaNode.attrs,
					alt: newAltText,
				})
				.setSelection(NodeSelection.create(tr.doc, originalSelectionPos));
		}

		return tr;
	};

export const updateAltText = (newAltText: string) =>
	createCommand((state) => {
		if (isMediaSingleOrInlineNodeSelected(state)) {
			return { type: 'updateAltText' };
		}
		return false;
	}, updateAltTextTransform(newAltText));
