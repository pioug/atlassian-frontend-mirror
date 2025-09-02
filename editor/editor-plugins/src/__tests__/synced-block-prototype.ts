// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('synced-block-prototype wrapper', () => {
	it('check ./synced-block-prototype exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-synced-block-prototype');
		const wrapper = require('../synced-block-prototype/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});

	it('check ./synced-block-prototype/SyncedBlock exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-synced-block-prototype/SyncedBlock');
		const wrapper = require('../synced-block-prototype/ui/extensions/synced-block/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
