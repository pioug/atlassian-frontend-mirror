// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('insert-block wrapper', () => {
	it('check ./insert-block exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-insert-block');
		const wrapper = require('../insert-block/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
