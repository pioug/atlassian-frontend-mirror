// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('ui-control-registry wrapper', () => {
	it('check ./ui-control-registry exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-ui-control-registry');
		const wrapper = require('../ui-control-registry/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
