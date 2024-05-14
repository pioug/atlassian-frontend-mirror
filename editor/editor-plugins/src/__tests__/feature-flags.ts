// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('feature-flags wrapper', () => {
    it('check ./feature-flags exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-feature-flags');
        const wrapper = require('../feature-flags/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
