import { type IntlShape } from 'react-intl-next';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	type EditorState,
	PluginKey,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { type BlockControlsPlugin } from '../types';
import { createEmptyBlockWidgetDecoration } from '../ui/empty-block-experiment/widget';

export const emptyBlockExperimentPluginKey = new PluginKey<EmptyBlockExperimentState>(
	'emptyBlockExperiment',
);

export type EmptyBlockExperimentState = {
	decorations: DecorationSet;
};

const getDecorations = (
	tr: ReadonlyTransaction,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	getIntl: () => IntlShape,
): DecorationSet => {
	const widget = createEmptyBlockWidgetDecoration(tr.selection, api, getIntl);

	if (widget) {
		return DecorationSet.create(tr.doc, [widget]);
	}
	return DecorationSet.empty;
};

export const createEmptyBlockExperimentPlugin = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	getIntl: () => IntlShape,
) => {
	return new SafePlugin({
		key: emptyBlockExperimentPluginKey,
		state: {
			init: (_: unknown, _editorState: EditorState) => ({
				decorations: DecorationSet.empty,
			}),
			apply: (tr: ReadonlyTransaction, _currentState: EmptyBlockExperimentState) => {
				return {
					decorations: getDecorations(tr, api, getIntl),
				};
			},
		},
		props: {
			decorations: (state: EditorState) => {
				return emptyBlockExperimentPluginKey.getState(state)?.decorations;
			},
		},
	});
};
