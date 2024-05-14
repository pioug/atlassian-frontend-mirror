// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('image-upload wrapper', () => {
    it('check ./image-upload exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-image-upload');
        const wrapper = require('../image-upload/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
