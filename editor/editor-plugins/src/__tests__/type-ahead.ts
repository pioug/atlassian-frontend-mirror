// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('type-ahead wrapper', () => {
    it('check ./type-ahead exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-type-ahead');
        const wrapper = require('../type-ahead/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
