// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('user-preferences wrapper', () => {
	it('check ./user-preferences exports all the same variables as the original', () => {
		const original = require('@atlaskit/editor-plugin-user-preferences');
		const wrapper = require('../user-preferences/index');
		const originalKeys = Object.keys(original).sort();
		const wrapperKeys = Object.keys(wrapper).sort();
		expect(originalKeys).toEqual(wrapperKeys);
	});
});
