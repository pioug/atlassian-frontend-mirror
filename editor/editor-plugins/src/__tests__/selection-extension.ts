// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('selection-extension wrapper', () => {
	it('check ./selection-extension exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-selection-extension');
		const wrapper = require('../selection-extension/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
