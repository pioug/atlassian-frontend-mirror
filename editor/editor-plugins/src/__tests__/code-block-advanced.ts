// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('code-block-advanced wrapper', () => {
	it('check ./code-block-advanced exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-code-block-advanced');
		const wrapper = require('../code-block-advanced/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
