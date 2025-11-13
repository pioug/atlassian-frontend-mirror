import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { getAnnotationMarksForPos } from '@atlaskit/editor-common/utils';
import {
	Fragment,
	type Mark,
	type Node,
	type ResolvedPos,
} from '@atlaskit/editor-prosemirror/model';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EmojiId } from '@atlaskit/emoji';

export const createEmojiFragment = (doc: Node, pos: ResolvedPos, emoji: EmojiId): Fragment => {
	const { id = '', fallback, shortName } = emoji;
	const annotationMarksForPos: Mark[] | undefined = getAnnotationMarksForPos(pos);

	const emojiNode = doc.type.schema.nodes.emoji.createChecked(
		{
			shortName,
			id,
			text: fallback || shortName,
		},
		null,
		annotationMarksForPos,
	);
	const space = doc.type.schema.text(' ', annotationMarksForPos);

	return Fragment.fromArray([emojiNode, space]);
};

export const insertEmoji =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		emojiId: EmojiId,
		inputMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.ASCII | INPUT_METHOD.TYPEAHEAD,
	): EditorCommand => {
		return ({ tr }) => {
			const { doc, selection } = tr;
			const { emoji } = tr.doc.type.schema.nodes;

			if (emoji && emojiId) {
				const fragment = createEmojiFragment(doc, selection.$head, emojiId);

				const newTr = safeInsert(fragment)(tr);
				if (inputMethod) {
					editorAnalyticsAPI?.attachAnalyticsEvent({
						action: ACTION.INSERTED,
						actionSubject: ACTION_SUBJECT.DOCUMENT,
						actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
						attributes: { inputMethod },
						eventType: EVENT_TYPE.TRACK,
					})(newTr);
				}

				newTr.setSelection(Selection.near(newTr.doc.resolve(selection.$from.pos + fragment.size)));
				return newTr;
			}
			return null;
		};
	};
