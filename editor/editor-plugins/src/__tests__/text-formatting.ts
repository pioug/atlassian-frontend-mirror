// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('text-formatting wrapper', () => {
    it('check ./text-formatting exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-text-formatting');
        const wrapper = require('../text-formatting/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
