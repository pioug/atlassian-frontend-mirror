// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('submit-editor wrapper', () => {
    it('check ./submit-editor exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-submit-editor');
        const wrapper = require('../submit-editor/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
