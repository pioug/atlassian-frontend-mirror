// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('grid wrapper', () => {
    it('check ./grid exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-grid');
        const wrapper = require('../grid/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
