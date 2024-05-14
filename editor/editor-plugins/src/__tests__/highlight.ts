// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('highlight wrapper', () => {
    it('check ./highlight exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-highlight');
        const wrapper = require('../highlight/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
