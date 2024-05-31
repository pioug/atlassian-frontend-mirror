// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('quick-insert wrapper', () => {
	it('check ./quick-insert exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-quick-insert');
		const wrapper = require('../quick-insert/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
