// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('border wrapper', () => {
    it('check ./border exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-border');
        const wrapper = require('../border/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
