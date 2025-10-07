// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('block-type wrapper', () => {
	it('check ./block-type exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-block-type');
		const wrapper = require('../block-type/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./block-type/consts exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-block-type/consts');
		const wrapper = require('../block-type/ui/consts');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
