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

	it('check ./synced-block/synced-block-plugin exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-synced-block/synced-block-plugin');
		const wrapper = require('../synced-block/entry-points/synced-block-plugin');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./synced-block/synced-block-plugin-type exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-synced-block/synced-block-plugin-type');
		const wrapper = require('../synced-block/entry-points/synced-block-plugin-type');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./synced-block/types exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-synced-block/types');
		const wrapper = require('../synced-block/types/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
