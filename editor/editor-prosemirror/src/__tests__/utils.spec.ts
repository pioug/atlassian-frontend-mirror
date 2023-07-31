import * as original from 'prosemirror-utils';

import * as wrapper from '../utils';

describe('prosemirror-utils', () => {
  it('should export the same public functions', () => {
    const originalPublicFunctions = Object.keys(original)
      .filter(f => !f.startsWith('__'))
      .sort();
    const wrapperFunctions = Object.keys(wrapper).sort();

    expect(wrapperFunctions).toEqual(originalPublicFunctions);
  });
});
