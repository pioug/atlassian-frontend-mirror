// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('hyperlink wrapper', () => {
    it('check ./hyperlink exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-hyperlink');
        const wrapper = require('../hyperlink/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
