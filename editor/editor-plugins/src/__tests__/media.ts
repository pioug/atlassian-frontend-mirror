// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('media wrapper', () => {
	it('check ./media exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-media');
		const wrapper = require('../media/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./media/types exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-media/types');
		const wrapper = require('../media/types/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
