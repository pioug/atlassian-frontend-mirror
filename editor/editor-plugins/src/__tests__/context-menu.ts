// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('context-menu wrapper', () => {
	it('check ./context-menu exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-context-menu');
		const wrapper = require('../context-menu/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
