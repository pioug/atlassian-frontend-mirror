import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { LoomPlugin } from '../loomPluginType';
import type { LoomProviderOptions, PositionType, VideoMeta } from '../types';
import { getQuickInsertItem } from '../ui/quickInsert';

import { LoomPluginAction, loomPluginKey } from './main';

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
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
		inputMethod: INPUT_METHOD;
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
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
		error: SDKUnsupportedReasons | undefined;
		inputMethod: INPUT_METHOD;
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

export const executeRecordVideo = (api: ExtractInjectionAPI<LoomPlugin> | undefined) => {
	api?.core?.actions.execute(
		recordVideo({
			inputMethod: INPUT_METHOD.TOOLBAR,
			editorAnalyticsAPI: api?.analytics?.actions,
		}),
	);
};

export const setupLoom = async (
	loomProvider: LoomProviderOptions,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
	editorView: EditorView | null,
	/**
	 * Whether loom initialisation is evoked via `initLoom` command.
	 */
	initViaCommand?: boolean,
): Promise<{ error?: string }> => {
	const clientResult = await loomProvider.getClient();

	if (clientResult.status === 'error') {
		api?.core?.actions.execute(disableLoom({ error: clientResult.message }));
		logException(new Error(clientResult.message), {
			location: 'editor-plugin-loom/sdk-initialisation',
		});
		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.ERRORED,
			actionSubject: ACTION_SUBJECT.LOOM,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: { error: clientResult.message },
		});
		return { error: clientResult.message };
	}

	const { attachToButton } = clientResult.client;

	// Hidden element to work around the SDK API
	const loomButton = document.createElement('button');
	attachToButton({
		button: loomButton,
		onInsert: (video) => {
			if (!editorView) {
				return;
			}
			const { state, dispatch } = editorView;
			const pos = state.selection.from;
			api?.hyperlink?.actions.insertLink(
				INPUT_METHOD.TYPEAHEAD,
				pos, // from === to, don't replace text to avoid accidental content loss
				pos,
				video.sharedUrl,
				video.title,
				undefined,
				undefined,
				undefined,
				'embed', // Convert to embed card instead of inline
			)(state, dispatch);

			api?.core?.actions.execute(
				insertVideo({ editorAnalyticsAPI: api?.analytics?.actions, video }),
			);
		},
	});

	api?.core?.actions.execute(({ tr }) => {
		enableLoom({ loomButton })({ tr });
		if (initViaCommand) {
			api?.quickInsert?.commands.addQuickInsertItem(getQuickInsertItem(api?.analytics?.actions))({
				tr,
			});
		}
		return tr;
	});

	// We're not combining the analytics steps into the enable / disable commands because the collab-edit plugin
	// filters out any transactions with steps (even analytics) when it's initialising.
	// Even if `initViaCommand` is true, collab-edit might not be ready depending on when `initLoom` is called,
	// hence the analytics step is added separately in both cases
	api?.analytics?.actions.fireAnalyticsEvent({
		action: ACTION.INITIALISED,
		actionSubject: ACTION_SUBJECT.LOOM,
		eventType: EVENT_TYPE.OPERATIONAL,
	});

	return {};
};
