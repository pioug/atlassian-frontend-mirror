// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('block-collapse wrapper', () => {
	it('check ./block-collapse/blockCollapsePlugin exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-block-collapse/blockCollapsePlugin');
		const wrapper = require('../block-collapse/entry-points/blockCollapsePlugin');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./block-collapse/blockCollapsePluginType exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-block-collapse/blockCollapsePluginType');
		const wrapper = require('../block-collapse/entry-points/blockCollapsePluginType');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
