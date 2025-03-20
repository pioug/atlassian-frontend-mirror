import { act, renderHook } from '@testing-library/react-hooks';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type {
	AllEditorPresetPluginTypes,
	EditorPresetBuilder,
} from '@atlaskit/editor-common/preset';
import { PublicPluginAPI } from '@atlaskit/editor-common/types';
import {
	EditorViewModePlugin,
	editorViewModePlugin,
} from '@atlaskit/editor-plugins/editor-viewmode';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
	createProsemirrorEditorFactory,
	Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getEditorViewMode } from '../../FullPage/getEditorViewModeSync';

jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

const createEditor = createProsemirrorEditorFactory();

const useEditorViewMode = (
	api: PublicPluginAPI<EditorViewModePlugin> | undefined,
	preset: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>,
) => {
	const { editorViewModeState } = useSharedPluginState(api, ['editorViewMode']);
	return getEditorViewMode(editorViewModeState, preset);
};

ffTest.on('platform_editor_sync_editor_view_mode_state', '', () => {
	it('should be undefined if no view mode plugin', () => {
		const preset = new Preset<LightEditorPlugin>();
		const { editorAPI } = createEditor({
			preset,
		});
		const result = renderHook(() => useEditorViewMode(editorAPI, preset));
		expect(result.result.current).toBe(undefined);
	});
	it('should default to undefined if no config passed', () => {
		const preset = new Preset<LightEditorPlugin>().add([editorViewModePlugin, {}]);
		const result = renderHook(() => useEditorViewMode(undefined, preset));
		expect(result.result.current).toBe(undefined);
	});
	it('should default to the config (view)', () => {
		const preset = new Preset<LightEditorPlugin>().add([editorViewModePlugin, { mode: 'view' }]);
		const result = renderHook(() => useEditorViewMode(undefined, preset));
		expect(result.result.current).toBe('view');
	});
	it('should default to the config (edit)', () => {
		const preset = new Preset<LightEditorPlugin>().add([editorViewModePlugin, { mode: 'edit' }]);
		const result = renderHook(() => useEditorViewMode(undefined, preset));
		expect(result.result.current).toBe('edit');
	});
	it('should change the value if the api value is called (edit -> view)', () => {
		const preset = new Preset<LightEditorPlugin>().add(editorViewModePlugin);
		const { editorAPI } = createEditor({
			preset,
		});
		const result = renderHook(() => useEditorViewMode(editorAPI, preset));
		expect(result.result.current).toBe('edit');
		act(() => {
			editorAPI?.core.actions.execute(editorAPI?.editorViewMode.commands.updateViewMode('view'));
		});
		expect(result.result.current).toBe('view');
	});

	it('should change the value if the api value is called (view -> edit)', () => {
		const preset = new Preset<LightEditorPlugin>().add([editorViewModePlugin, { mode: 'view' }]);
		const { editorAPI } = createEditor({
			preset,
		});
		const result = renderHook(() => useEditorViewMode(editorAPI, preset));
		expect(result.result.current).toBe('view');
		act(() => {
			editorAPI?.core.actions.execute(editorAPI?.editorViewMode.commands.updateViewMode('edit'));
		});
		expect(result.result.current).toBe('edit');
	});
});
