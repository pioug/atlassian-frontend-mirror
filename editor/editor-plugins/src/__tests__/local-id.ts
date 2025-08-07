// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('local-id wrapper', () => {
	it('check ./local-id exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-local-id');
		const wrapper = require('../local-id/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
