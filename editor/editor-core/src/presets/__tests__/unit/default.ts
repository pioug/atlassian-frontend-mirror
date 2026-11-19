import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';

import { createDefaultPreset } from '../../default';

const getDefaultPresetPluginNames = () =>
	createDefaultPreset({})
		.build()
		.map(({ name }) => name);

describe('createDefaultPreset layout column controls', () => {
	it('adds the registry for layout column controls when core ownership is disabled', () => {
		mockExpDisabled('platform_editor_ui_control_registry');

		expect(getDefaultPresetPluginNames()).toContain('uiControlRegistry');
	});
});
