// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('code-block wrapper', () => {
  it('check ./code-block exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-code-block');
    const wrapper = require('../code-block/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
