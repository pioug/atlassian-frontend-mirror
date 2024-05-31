// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('unsupported-content wrapper', () => {
	it('check ./unsupported-content exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-unsupported-content');
		const wrapper = require('../unsupported-content/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
