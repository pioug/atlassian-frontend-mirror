import debounce from 'lodash/debounce';

import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyDocument } from '@atlaskit/editor-common/utils';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { SelectionMarkerPlugin } from '../selectionMarkerPluginType';
import { selectionDecoration } from '../ui/selection-decoration';
import { createWidgetDecoration } from '../ui/widget-decoration';

export interface PluginState {
	decorations: DecorationSet;
	decorationType: DecorationType;
	forceHide: boolean;
	shouldHideDecorations: boolean;
}

export const key = new PluginKey<PluginState>('selectionMarker');

type DecorationType = 'blur' | 'highlight' | 'none';

function getDecorations(tr: ReadonlyTransaction, type: DecorationType): DecorationSet {
	const { selection } = tr;
	switch (type) {
		case 'none':
			return DecorationSet.empty;
		case 'highlight':
			return DecorationSet.create(tr.doc, [
				...createWidgetDecoration(selection.$anchor, 'anchor', selection, true),
				...selectionDecoration(tr.doc, selection, true),
				...createWidgetDecoration(selection.$head, 'head', selection, true),
			]);
		case 'blur':
			return DecorationSet.create(tr.doc, [
				...createWidgetDecoration(selection.$anchor, 'anchor', selection, false),
				...selectionDecoration(tr.doc, selection, false),
			]);
	}
}

function getDecorationType(
	tr: ReadonlyTransaction,
	shouldHideDecorations: boolean,
): 'none' | 'blur' {
	if (shouldHideDecorations || isEmptyDocument(tr.doc)) {
		return 'none';
	}
	// TODO: ED-26961 - implement "highlight" for AI features
	return 'blur';
}

export const applyNextPluginState = (
	tr: ReadonlyTransaction,
	currentState: PluginState,
	oldEditorState: EditorState,
):
	| PluginState
	| {
			decorations: DecorationSet;
			decorationType: 'none' | 'blur';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			forceHide: any;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			shouldHideDecorations: any;
	  } => {
	const meta = tr.getMeta(key);
	if (!meta && !tr.selectionSet) {
		return currentState;
	}

	const forceHide = meta?.forceHide ?? currentState.forceHide;
	const shouldHideDecorations = meta?.shouldHideDecorations ?? currentState.shouldHideDecorations;
	const type = getDecorationType(tr, shouldHideDecorations);

	let nextDecorations = currentState.decorations;
	const hasSelectionChangedToRange = oldEditorState.selection.empty && !tr.selection.empty;

	if (hasSelectionChangedToRange || currentState.decorationType !== type) {
		nextDecorations = getDecorations(tr, type);
	} else {
		nextDecorations = nextDecorations.map(tr.mapping, tr.doc, {});
	}

	return {
		decorations: nextDecorations,
		shouldHideDecorations,
		forceHide,
		decorationType: type,
	};
};

const debouncedDecorations = debounce((state: EditorState) => {
	return key.getState(state)?.decorations;
}, 25);

export const createPlugin = (api: ExtractInjectionAPI<SelectionMarkerPlugin> | undefined) => {
	return new SafePlugin<PluginState>({
		key,
		state: {
			init() {
				return {
					decorations: DecorationSet.empty,
					shouldHideDecorations: true,
					forceHide: false,
					decorationType: 'none',
				};
			},
			apply: applyNextPluginState,
		},
		props: {
			decorations: (state: EditorState) => {
				const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? getBrowserInfo()
					: browserLegacy;
				if (browser.ie) {
					return debouncedDecorations(state);
				} else {
					return key.getState(state)?.decorations;
				}
			},
		},
	});
};

export function dispatchShouldHideDecorations(
	editorView: EditorView,
	shouldHideDecorations: boolean,
): void {
	const { dispatch, state } = editorView;
	dispatch(
		state.tr.setMeta(key, {
			shouldHideDecorations,
		}),
	);
}
