// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('rule wrapper', () => {
    it('check ./rule exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-rule');
        const wrapper = require('../rule/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
