// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('width wrapper', () => {
    it('check ./width exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-width');
        const wrapper = require('../width/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
