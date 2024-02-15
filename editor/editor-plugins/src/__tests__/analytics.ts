// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('analytics wrapper', () => {
  it('check ./analytics exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-analytics');
    const wrapper = require('../analytics/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
