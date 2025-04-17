// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('interaction wrapper', () => {
	it('check ./interaction exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-interaction');
		const wrapper = require('../interaction/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
