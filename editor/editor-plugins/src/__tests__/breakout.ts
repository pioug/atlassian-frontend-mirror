// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('breakout wrapper', () => {
    it('check ./breakout exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-breakout');
        const wrapper = require('../breakout/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
