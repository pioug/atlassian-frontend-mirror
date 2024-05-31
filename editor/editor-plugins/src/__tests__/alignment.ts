// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('alignment wrapper', () => {
	it('check ./alignment exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-alignment');
		const wrapper = require('../alignment/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
