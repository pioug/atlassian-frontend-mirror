import * as original from 'prosemirror-view';

import * as wrapper from '../view';

describe('prosemirror-view', () => {
  it('should export the same public functions', () => {
    const originalPublicFunctions = [
      ...Object.keys(original).filter(f => !f.startsWith('__')),
      // We are using those two prviate properties on Editor code :(
      '__parseFromClipboard',
      '__serializeForClipboard',
    ].sort();
    const wrapperFunctions = Object.keys(wrapper).sort();

    expect(wrapperFunctions).toEqual(originalPublicFunctions);
  });
});
