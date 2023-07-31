import * as original from 'prosemirror-keymap';

import * as wrapper from '../keymap';

describe('prosemirror-keymap', () => {
  it('should export the same public functions', () => {
    const originalPublicFunctions = Object.keys(original)
      .filter(f => !f.startsWith('__'))
      .sort();
    const wrapperFunctions = Object.keys(wrapper).sort();

    expect(wrapperFunctions).toEqual(originalPublicFunctions);
  });
});
