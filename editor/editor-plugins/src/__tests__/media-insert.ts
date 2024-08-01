// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('media-insert wrapper', () => {
	it('check ./media-insert exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-media-insert');
		const wrapper = require('../media-insert/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
