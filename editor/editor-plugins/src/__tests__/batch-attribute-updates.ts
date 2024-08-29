// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('batch-attribute-updates wrapper', () => {
	it('check ./batch-attribute-updates exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-batch-attribute-updates');
		const wrapper = require('../batch-attribute-updates/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
