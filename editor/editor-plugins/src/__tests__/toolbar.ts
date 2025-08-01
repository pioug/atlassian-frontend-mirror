// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('toolbar wrapper', () => {
	it('check ./toolbar exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-toolbar');
		const wrapper = require('../toolbar/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
