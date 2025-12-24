// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('media-editing wrapper', () => {
	it('check ./media-editing exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-media-editing');
		const wrapper = require('../media-editing/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
