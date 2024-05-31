// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('placeholder wrapper', () => {
	it('check ./placeholder exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-placeholder');
		const wrapper = require('../placeholder/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
