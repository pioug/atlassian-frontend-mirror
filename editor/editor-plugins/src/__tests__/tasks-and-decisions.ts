// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('tasks-and-decisions wrapper', () => {
  it('check ./tasks-and-decisions exports all the same variables as the original', () => {
    const original = require('@atlaskit/editor-plugin-tasks-and-decisions');
    const wrapper = require('../tasks-and-decisions/index');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });
});
