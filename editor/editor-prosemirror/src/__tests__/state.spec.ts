import * as original from 'prosemirror-state';

import * as wrapper from '../state';

describe('prosemirror-state', () => {
  it('should export the same public functions', () => {
    const originalPublicFunctions = Object.keys(original)
      .filter(f => !f.startsWith('__'))
      .sort();
    const wrapperFunctions = Object.keys(wrapper).sort();

    expect(wrapperFunctions).toEqual(originalPublicFunctions);
  });
});
