// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('synced-block wrapper', () => {
	it('check ./synced-block exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-synced-block');
		const wrapper = require('../synced-block/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
