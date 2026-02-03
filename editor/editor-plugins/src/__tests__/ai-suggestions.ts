// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('ai-suggestions wrapper', () => {
	it('check ./ai-suggestions exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-ai-suggestions');
		const wrapper = require('../ai-suggestions/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
