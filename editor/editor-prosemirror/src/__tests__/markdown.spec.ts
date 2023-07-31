import * as original from 'prosemirror-markdown';

import * as wrapper from '../markdown';

const internalFunctions = [
  // see: https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/schema.ts#L4
  'schema',
];
describe('prosemirror-markdown', () => {
  it('should export the same public functions', () => {
    const originalPublicFunctions = Object.keys(original)
      .filter(f => !f.startsWith('__'))
      .filter(f => !internalFunctions.includes(f))
      .sort();
    const wrapperFunctions = Object.keys(wrapper).sort();

    expect(wrapperFunctions).toEqual(originalPublicFunctions);
  });
});
