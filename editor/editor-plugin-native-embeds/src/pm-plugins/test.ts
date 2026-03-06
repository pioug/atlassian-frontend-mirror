import { Schema } from '@atlaskit/editor-prosemirror/model';
import { EditorState } from '@atlaskit/editor-prosemirror/state';

import { showUrlToolbar, hideUrlToolbar } from './actions';
import { createPlugin, pluginKey, type NativeEmbedsPluginState } from './plugin-state';

const schema = new Schema({
	nodes: {
		doc: { content: 'text*' },
		text: {},
	},
});

describe('nativeEmbedsPlugin state', () => {
	const createEditorState = () =>
		EditorState.create({
			schema,
			plugins: [createPlugin()],
		});

	it('should initialize with showUrlToolbar: false', () => {
		const state = createEditorState();
		const pluginState = pluginKey.getState(state);

		expect(pluginState).toEqual<NativeEmbedsPluginState>({
			showUrlToolbar: false,
		});
	});

	describe('showUrlToolbar action', () => {
		it('should set showUrlToolbar to true', () => {
			const state = createEditorState();
			const tr = showUrlToolbar(state.tr);
			const newState = state.apply(tr);

			const pluginState = pluginKey.getState(newState);
			expect(pluginState?.showUrlToolbar).toBe(true);
		});
	});

	describe('hideUrlToolbar action', () => {
		it('should set showUrlToolbar to false', () => {
			const state = createEditorState();

			// First show the toolbar
			const showTr = showUrlToolbar(state.tr);
			const stateWithToolbar = state.apply(showTr);
			expect(pluginKey.getState(stateWithToolbar)?.showUrlToolbar).toBe(true);

			// Then hide it
			const hideTr = hideUrlToolbar(stateWithToolbar.tr);
			const finalState = stateWithToolbar.apply(hideTr);

			expect(pluginKey.getState(finalState)?.showUrlToolbar).toBe(false);
		});

		it('should keep showUrlToolbar as false if already false', () => {
			const state = createEditorState();
			const tr = hideUrlToolbar(state.tr);
			const newState = state.apply(tr);

			const pluginState = pluginKey.getState(newState);
			expect(pluginState?.showUrlToolbar).toBe(false);
		});
	});

	it('should not change state for unrelated transactions', () => {
		const state = createEditorState();
		const tr = state.tr.insertText('hello');
		const newState = state.apply(tr);

		const pluginState = pluginKey.getState(newState);
		expect(pluginState?.showUrlToolbar).toBe(false);
	});
});
