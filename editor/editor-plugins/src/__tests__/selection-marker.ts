// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('selection-marker wrapper', () => {
	it('check ./selection-marker exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-selection-marker');
		const wrapper = require('../selection-marker/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
