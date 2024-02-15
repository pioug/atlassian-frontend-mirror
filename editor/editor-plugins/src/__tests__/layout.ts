// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('layout wrapper', () => {
  it('check ./layout exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-layout');
    const wrapper = require('../layout/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
