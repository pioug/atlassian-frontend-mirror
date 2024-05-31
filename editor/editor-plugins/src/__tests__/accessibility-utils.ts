// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('accessibility-utils wrapper', () => {
	it('check ./accessibility-utils exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-accessibility-utils');
		const wrapper = require('../accessibility-utils/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
