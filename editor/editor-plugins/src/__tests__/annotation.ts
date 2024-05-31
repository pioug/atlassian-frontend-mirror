// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('annotation wrapper', () => {
	it('check ./annotation exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-annotation');
		const wrapper = require('../annotation/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
