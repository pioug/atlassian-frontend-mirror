import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { LoomPlugin } from './plugin';
import { LoomPluginAction, loomPluginKey } from './pm-plugin';
import type { PositionType, VideoMeta } from './types';

export const enableLoom =
	({ loomButton }: { loomButton: HTMLButtonElement }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(loomPluginKey, {
			type: LoomPluginAction.ENABLE,
			loomButton,
		});
		return tr;
	};

export const disableLoom =
	({ error }: { error: string }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(loomPluginKey, {
			type: LoomPluginAction.DISABLE,
			error,
		});
		return tr;
	};

export const recordVideo =
	({
		inputMethod,
		editorAnalyticsAPI,
	}: {
		inputMethod: INPUT_METHOD;
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	}): EditorCommand =>
	({ tr }) => {
		tr.setMeta(loomPluginKey, {
			type: LoomPluginAction.RECORD_VIDEO,
		});
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.RECORD_VIDEO,
			actionSubject: ACTION_SUBJECT.LOOM,
			attributes: {
				inputMethod,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);

		return tr;
	};

export const recordVideoFailed =
	({
		inputMethod,
		error,
		editorAnalyticsAPI,
	}: {
		inputMethod: INPUT_METHOD;
		error: SDKUnsupportedReasons | undefined;
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	}): EditorCommand =>
	({ tr }) => {
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.RECORD_VIDEO_FAILED,
			actionSubject: ACTION_SUBJECT.LOOM,
			attributes: {
				inputMethod,
				error,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);

		return tr;
	};

export const insertVideo =
	({
		editorAnalyticsAPI,
		video,
	}: {
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
		video: VideoMeta;
	}): EditorCommand =>
	({ tr }) => {
		tr.setMeta(loomPluginKey, {
			type: LoomPluginAction.INSERT_VIDEO,
		});
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.INSERT_VIDEO,
			actionSubject: ACTION_SUBJECT.LOOM,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				duration: video.duration,
			},
		})(tr);

		return tr;
	};

const getPositions = (tr: Transaction, posType: PositionType): { from: number; to: number } => {
	const selection = tr.selection;

	switch (posType) {
		case 'current':
			return { from: selection.from, to: selection.from };
		case 'start':
			return { from: 0, to: 0 };
		case 'end':
			return { from: tr.doc.content.size, to: tr.doc.content.size };
	}
};

export const insertLoom = (
	editorView: EditorView | null,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
	video: VideoMeta,
	positionType: PositionType,
): boolean => {
	if (!editorView) {
		return false;
	}
	const { state, dispatch } = editorView;
	const { from, to } = getPositions(state.tr, positionType);

	return (
		api?.hyperlink?.actions.insertLink(
			INPUT_METHOD.TYPEAHEAD,
			from,
			to,
			video.sharedUrl,
			video.title,
			undefined,
			undefined,
			undefined,
			'embed', // Convert to embed card instead of inline
		)(state, dispatch) ?? false
	);
};
