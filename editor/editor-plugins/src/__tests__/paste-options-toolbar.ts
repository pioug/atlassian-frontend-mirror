// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('paste-options-toolbar wrapper', () => {
  it('check ./paste-options-toolbar exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-paste-options-toolbar');
    const wrapper = require('../paste-options-toolbar/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });

  it('check ./paste-options-toolbar/styles exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-paste-options-toolbar/styles');
    const wrapper = require('../paste-options-toolbar/styles');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
