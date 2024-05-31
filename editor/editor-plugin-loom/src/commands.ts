import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { EditorCommand } from '@atlaskit/editor-common/types';

import { LoomPluginAction, loomPluginKey } from './pm-plugin';
import type { VideoMeta } from './types';

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
