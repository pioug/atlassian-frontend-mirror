// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('block-menu wrapper', () => {
	it('check ./block-menu exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-block-menu');
		const wrapper = require('../block-menu/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
