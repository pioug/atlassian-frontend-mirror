// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('date wrapper', () => {
	it('check ./date exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-date');
		const wrapper = require('../date/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
