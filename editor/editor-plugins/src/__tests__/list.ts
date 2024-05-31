// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('list wrapper', () => {
	it('check ./list exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-list');
		const wrapper = require('../list/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
