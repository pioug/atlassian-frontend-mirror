// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('caption wrapper', () => {
	it('check ./caption exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-caption');
		const wrapper = require('../caption/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
