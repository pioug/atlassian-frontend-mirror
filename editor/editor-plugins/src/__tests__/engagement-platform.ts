// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('engagement-platform wrapper', () => {
	it('check ./engagement-platform exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-engagement-platform');
		const wrapper = require('../engagement-platform/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
