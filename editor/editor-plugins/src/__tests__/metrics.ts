// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('metrics wrapper', () => {
	it('check ./metrics exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-metrics');
		const wrapper = require('../metrics/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
