// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('card wrapper', () => {
  it('check ./card exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-card');
    const wrapper = require('../card/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
