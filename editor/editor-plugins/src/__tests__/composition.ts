// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('composition wrapper', () => {
	it('check ./composition exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-composition');
		const wrapper = require('../composition/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
