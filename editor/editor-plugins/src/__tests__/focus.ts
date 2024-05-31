// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('focus wrapper', () => {
	it('check ./focus exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-focus');
		const wrapper = require('../focus/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
