// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('content-format wrapper', () => {
	it('check ./content-format exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-content-format');
		const wrapper = require('../content-format/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
