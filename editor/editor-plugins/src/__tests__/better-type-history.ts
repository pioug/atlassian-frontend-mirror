// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('better-type-history wrapper', () => {
  it('check ./better-type-history exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-better-type-history');
    const wrapper = require('../better-type-history/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
