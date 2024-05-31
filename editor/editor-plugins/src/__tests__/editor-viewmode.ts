// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('editor-viewmode wrapper', () => {
	it('check ./editor-viewmode exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-editor-viewmode');
		const wrapper = require('../editor-viewmode/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
