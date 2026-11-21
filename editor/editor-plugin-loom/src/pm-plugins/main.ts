import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey, Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { LoomPlugin } from '../loomPluginType';
import type { LoomPluginOptions } from '../types';
import { setupLoom } from './commands';

export interface LoomPluginState {
	error: SDKUnsupportedReasons | undefined;
	isEnabled: boolean;
	isRecordingVideo: boolean;
	loomButton: HTMLButtonElement | null;
	/** A null selection means the recording target was deleted while the recorder was open. */
	recordingSelection?: Selection | null;
	recordVideo?: (source: 'editor-pinned-toolbar') => void;
}

export enum LoomPluginAction {
	ENABLE,
	DISABLE,
	RECORD_VIDEO,
	INSERT_VIDEO,
}

export const loomPluginKey: PluginKey<LoomPluginState> = new PluginKey<LoomPluginState>('loom');

const updateRecordingSelection = (
	tr: ReadonlyTransaction,
	pluginState: LoomPluginState,
	view: EditorView | undefined,
): LoomPluginState => {
	const { recordingSelection } = pluginState;
	if (recordingSelection === undefined) {
		return pluginState;
	}

	if (tr.selectionSet) {
		const { selection } = tr;
		const cameFromPointer = tr.getMeta('pointer');
		const editorKeptFocus = view?.hasFocus() && !tr.getMeta('replaceDocument');

		// A background reset can send the caret to the document start while recording.
		const looksLikeReset =
			!cameFromPointer &&
			!editorKeptFocus &&
			selection.empty &&
			selection.eq(Selection.atStart(tr.doc));
		if (!looksLikeReset) {
			return { ...pluginState, recordingSelection: selection };
		}
	}

	if (!recordingSelection || !tr.docChanged) {
		return pluginState;
	}

	const targetWasDeleted = tr.mapping.mapResult(recordingSelection.to).deletedAcross;
	return {
		...pluginState,
		recordingSelection: targetWasDeleted ? null : recordingSelection.map(tr.doc, tr.mapping),
	};
};

export const createPlugin = ({
	config,
	api,
}: {
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
	config: LoomPluginOptions;
}): SafePlugin<LoomPluginState> => {
	let view: EditorView | undefined;
	return new SafePlugin({
		key: loomPluginKey,
		state: {
			init: (): LoomPluginState => ({
				isEnabled: false,
				loomButton: null,
				isRecordingVideo: false,
				error: undefined,
			}),
			apply: (tr: ReadonlyTransaction, pluginState: LoomPluginState): LoomPluginState => {
				const action = tr.getMeta(loomPluginKey)?.type;
				switch (action) {
					case LoomPluginAction.ENABLE:
						const { loomButton, recordVideo } = tr.getMeta(loomPluginKey);
						return {
							...pluginState,
							isEnabled: true,
							loomButton,
							recordVideo,
						};
					case LoomPluginAction.DISABLE:
						const { error } = tr.getMeta(loomPluginKey);
						return {
							...pluginState,
							isEnabled: false,
							loomButton: null,
							recordingSelection: undefined,
							error,
						};
					case LoomPluginAction.RECORD_VIDEO:
						// Click the unmounted button in state that has the Loom SDK attached
						const { source } = tr.getMeta(loomPluginKey);
						if (
							source === 'editor-pinned-toolbar' &&
							pluginState.recordVideo &&
							isExperimentEnabled('twc_growth_loom_conf_pinned_toolbar')
						) {
							pluginState.recordVideo(source);
						} else {
							pluginState?.loomButton?.click();
						}

						return {
							...pluginState,
							isRecordingVideo: true,
							recordingSelection: isExperimentEnabled('twc_growth_loom_conf_pinned_toolbar')
								? tr.selection
								: undefined,
						};
					case LoomPluginAction.INSERT_VIDEO:
						return {
							...pluginState,
							isRecordingVideo: false,
							recordingSelection: undefined,
						};
					default:
						return updateRecordingSelection(tr, pluginState, view);
				}
			},
		},
		view(editorView: EditorView) {
			view = editorView;
			if (config.loomProvider) {
				setupLoom(config.loomProvider, api, editorView);
			}

			return {
				destroy: () => {
					view = undefined;
				},
			};
		},
	});
};
