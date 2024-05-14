// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('text-color wrapper', () => {
    it('check ./text-color exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-text-color');
        const wrapper = require('../text-color/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
