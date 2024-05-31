// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('table wrapper', () => {
	it('check ./table/types exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-table/types');
		const wrapper = require('../table/types');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./table exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-table');
		const wrapper = require('../table/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./table/ui/common-styles exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-table/ui/common-styles');
		const wrapper = require('../table/ui/common-styles');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./table/ui/consts exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-table/ui/consts');
		const wrapper = require('../table/ui/consts');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./table/plugin-key exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-table/plugin-key');
		const wrapper = require('../table/pm-plugins/plugin-key');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./table/commands exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-table/commands');
		const wrapper = require('../table/commands/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
