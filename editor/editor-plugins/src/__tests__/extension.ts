// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('extension wrapper', () => {
  it('check ./extension exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-extension');
    const wrapper = require('../extension/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
