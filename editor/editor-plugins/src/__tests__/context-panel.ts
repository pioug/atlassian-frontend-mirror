// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('context-panel wrapper', () => {
    it('check ./context-panel exports all the same variables as the original', () => {
        const original = require('@atlaskit/editor-plugin-context-panel');
        const wrapper = require('../context-panel/index');
        const originalKeys = Object.keys(original).sort();
        const wrapperKeys = Object.keys(wrapper).sort();
        expect(originalKeys).toEqual(wrapperKeys);
    });
});
