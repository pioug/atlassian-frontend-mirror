import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
	AnalyticsEventPayload,
	EditorAnalyticsAPI,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { removeMark, toggleMark } from '@atlaskit/editor-common/mark';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { highlightColorPalette, REMOVE_HIGHLIGHT_COLOR } from '@atlaskit/editor-common/ui-color';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { HighlightPluginAction, highlightPluginKey } from '../pm-plugins/main';
import { getActiveColor } from '../utils/color';

export const changeColor =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	({ color, inputMethod }: { color: string; inputMethod: INPUT_METHOD }): EditorCommand =>
	({ tr }) => {
		const { backgroundColor } = tr.doc.type.schema.marks;

		if (!backgroundColor) {
			return null;
		}

		editorAnalyticsAPI?.attachAnalyticsEvent(createAnalyticsEvent(color, inputMethod, tr))(tr);

		tr.scrollIntoView();

		if (color === REMOVE_HIGHLIGHT_COLOR) {
			removeMark(backgroundColor)({ tr });
		} else {
			tr.setMeta(highlightPluginKey, {
				type: HighlightPluginAction.CHANGE_COLOR,
				color,
			});

			toggleMark(backgroundColor, { color })({ tr });
		}

		return tr;
	};

const createAnalyticsEvent = (
	color: string,
	inputMethod: INPUT_METHOD,
	tr: Transaction,
): AnalyticsEventPayload => {
	const previousColor = getActiveColor(tr) ?? REMOVE_HIGHLIGHT_COLOR;
	// get color names from palette
	const newColorFromPalette = highlightColorPalette.find(({ value }) => value === color);
	const previousColorFromPalette = highlightColorPalette.find(
		({ value }) => value === previousColor,
	);

	const newColorLabel = newColorFromPalette ? newColorFromPalette.label : color;

	const previousColorLabel = previousColorFromPalette
		? previousColorFromPalette.label
		: previousColor;

	return {
		action: ACTION.FORMATTED,
		actionSubject: ACTION_SUBJECT.TEXT,
		actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			newColor: newColorLabel.toLowerCase(),
			previousColor: previousColorLabel ? previousColorLabel.toLowerCase() : '',
			inputMethod,
		},
	};
};
