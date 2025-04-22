// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('user-intent wrapper', () => {
	it('check ./user-intent exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-user-intent');
		const wrapper = require('../user-intent/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
