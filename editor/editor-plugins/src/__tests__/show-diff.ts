// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('show-diff wrapper', () => {
	it('check ./show-diff exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-show-diff');
		const wrapper = require('../show-diff/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
