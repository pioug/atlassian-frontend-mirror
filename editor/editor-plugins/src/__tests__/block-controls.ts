// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('block-controls wrapper', () => {
    it('check ./block-controls exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-block-controls');
        const wrapper = require('../block-controls/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
