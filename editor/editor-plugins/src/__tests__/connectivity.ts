// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('connectivity wrapper', () => {
	it('check ./connectivity exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-connectivity');
		const wrapper = require('../connectivity/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
