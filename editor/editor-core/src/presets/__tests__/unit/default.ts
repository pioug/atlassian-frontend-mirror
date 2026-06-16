import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

import { createDefaultPreset } from '../../default';

const getDefaultPresetPluginNames = () =>
	createDefaultPreset({})
		.build()
		.map(({ name }) => name);

const setupMenuExperiments = ({
	layoutColumnMenu,
	layoutColumnValignRendering,
}: {
	layoutColumnMenu: boolean;
	layoutColumnValignRendering: boolean;
}) => {
	setupEditorExperiments('test', {
		platform_editor_layout_column_menu: layoutColumnMenu,
		platform_editor_layout_column_valign_rendering: layoutColumnValignRendering,
		platform_editor_paste_actions_menu: false,
		platform_editor_table_menu_updates: false,
	});
};

describe('createDefaultPreset layout column controls', () => {
	afterEach(() => {
		setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
	});

	it('does not add authoring controls when only layout column vertical alignment rendering is enabled', () => {
		setupMenuExperiments({
			layoutColumnMenu: false,
			layoutColumnValignRendering: true,
		});

		expect(getDefaultPresetPluginNames()).not.toContain('uiControlRegistry');
	});

	it('keeps authoring controls gated by the layout column menu experiment', () => {
		setupMenuExperiments({
			layoutColumnMenu: true,
			layoutColumnValignRendering: false,
		});

		expect(getDefaultPresetPluginNames()).toContain('uiControlRegistry');
	});
});
