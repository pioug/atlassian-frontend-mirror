// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('editor-disabled wrapper', () => {
    it('check ./editor-disabled exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-editor-disabled');
        const wrapper = require('../editor-disabled/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
