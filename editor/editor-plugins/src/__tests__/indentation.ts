// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('indentation wrapper', () => {
  it('check ./indentation exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-indentation');
    const wrapper = require('../indentation/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
