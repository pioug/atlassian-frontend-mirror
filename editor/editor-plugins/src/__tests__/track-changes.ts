// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('track-changes wrapper', () => {
	it('check ./track-changes exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-track-changes');
		const wrapper = require('../track-changes/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
