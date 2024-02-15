// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('emoji wrapper', () => {
  it('check ./emoji exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-emoji');
    const wrapper = require('../emoji/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
