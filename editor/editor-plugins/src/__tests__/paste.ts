// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('paste wrapper', () => {
  it('check ./paste exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-paste');
    const wrapper = require('../paste/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
