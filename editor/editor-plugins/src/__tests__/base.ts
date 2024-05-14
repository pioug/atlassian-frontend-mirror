// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('base wrapper', () => {
    it('check ./base exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-base');
        const wrapper = require('../base/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
