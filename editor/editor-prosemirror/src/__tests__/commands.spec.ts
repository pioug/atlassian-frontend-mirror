import * as original from 'prosemirror-commands';

import * as wrapper from '../commands';

describe('prosemirror-commands', () => {
  it('should export the same public functions', () => {
    const originalPublicFunctions = Object.keys(original)
      .filter(f => !f.startsWith('__'))
      .sort();
    const wrapperFunctions = Object.keys(wrapper).sort();

    expect(wrapperFunctions).toEqual(originalPublicFunctions);
  });
});
