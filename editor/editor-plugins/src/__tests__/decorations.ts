// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('decorations wrapper', () => {
  it('check ./decorations exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-decorations');
    const wrapper = require('../decorations/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
