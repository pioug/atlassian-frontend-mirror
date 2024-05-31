// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('content-insertion wrapper', () => {
	it('check ./content-insertion exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-content-insertion');
		const wrapper = require('../content-insertion/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
