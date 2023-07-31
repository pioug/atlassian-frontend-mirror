import * as original from 'prosemirror-model';

import * as wrapper from '../model';

describe('prosemirror-model', () => {
  it('should export the same public functions', () => {
    const originalPublicFunctions = Object.keys(original)
      .filter(f => !f.startsWith('__'))
      .sort();
    const wrapperFunctions = Object.keys(wrapper).sort();

    expect(wrapperFunctions).toEqual(originalPublicFunctions);
  });
});
