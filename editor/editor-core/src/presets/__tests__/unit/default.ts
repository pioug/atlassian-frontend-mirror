import { createDefaultPreset } from '../../default';

const getDefaultPresetPluginNames = () =>
	createDefaultPreset({})
		.build()
		.map(({ name }) => name);

describe('createDefaultPreset layout column controls', () => {
	it('always adds authoring controls for the layout column menu', () => {
		expect(getDefaultPresetPluginNames()).toContain('uiControlRegistry');
	});
});
