// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('limited-mode wrapper', () => {
	it('check ./limited-mode exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-limited-mode');
		const wrapper = require('../limited-mode/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
