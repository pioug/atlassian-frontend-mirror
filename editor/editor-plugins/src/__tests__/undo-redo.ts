// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('undo-redo wrapper', () => {
	it('check ./undo-redo exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-undo-redo');
		const wrapper = require('../undo-redo/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
