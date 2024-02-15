// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('context-identifier wrapper', () => {
  it('check ./context-identifier exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-context-identifier');
    const wrapper = require('../context-identifier/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
