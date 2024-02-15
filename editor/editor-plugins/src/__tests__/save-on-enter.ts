// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('save-on-enter wrapper', () => {
  it('check ./save-on-enter exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-save-on-enter');
    const wrapper = require('../save-on-enter/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
