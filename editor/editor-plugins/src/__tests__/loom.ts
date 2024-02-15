// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('loom wrapper', () => {
  it('check ./loom exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-loom');
    const wrapper = require('../loom/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
