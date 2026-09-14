// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('interactivity wrapper', () => {
	it('check ./interactivity exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-interactivity');
		const wrapper = require('../interactivity/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
