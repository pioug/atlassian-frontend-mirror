// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('ncs-step-metrics wrapper', () => {
	it('check ./ncs-step-metrics exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-ncs-step-metrics');
		const wrapper = require('../ncs-step-metrics/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
