// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('help-dialog wrapper', () => {
    it('check ./help-dialog exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-help-dialog');
        const wrapper = require('../help-dialog/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
