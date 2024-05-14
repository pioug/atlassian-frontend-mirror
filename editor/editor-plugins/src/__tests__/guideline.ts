// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('guideline wrapper', () => {
    it('check ./guideline exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-guideline');
        const wrapper = require('../guideline/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
