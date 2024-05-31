// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('mentions wrapper', () => {
	it('check ./mentions exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-mentions');
		const wrapper = require('../mentions/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
