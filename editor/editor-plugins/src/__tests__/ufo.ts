// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('ufo wrapper', () => {
	it('check ./ufo exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-ufo');
		const wrapper = require('../ufo/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
