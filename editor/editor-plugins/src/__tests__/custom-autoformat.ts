// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('custom-autoformat wrapper', () => {
  it('check ./custom-autoformat exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-custom-autoformat');
    const wrapper = require('../custom-autoformat/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
