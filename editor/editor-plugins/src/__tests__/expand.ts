// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('expand wrapper', () => {
    it('check ./expand exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-expand');
        const wrapper = require('../expand/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
