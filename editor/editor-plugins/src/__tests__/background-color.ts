// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('background-color wrapper', () => {
	it('check ./background-color exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-background-color');
		const wrapper = require('../background-color/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
