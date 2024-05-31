// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('data-consumer wrapper', () => {
	it('check ./data-consumer exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-data-consumer');
		const wrapper = require('../data-consumer/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
