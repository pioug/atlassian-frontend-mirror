// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('autocomplete wrapper', () => {
	it('check ./autocomplete exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-autocomplete');
		const wrapper = require('../autocomplete/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./autocomplete/autocompletePlugin exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-autocomplete/autocompletePlugin');
		const wrapper = require('../autocomplete/entry-points/autocompletePlugin');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./autocomplete/autocompletePluginType exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-autocomplete/autocompletePluginType');
		const wrapper = require('../autocomplete/entry-points/autocompletePluginType');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
