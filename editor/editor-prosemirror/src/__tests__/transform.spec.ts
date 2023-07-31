import * as original from 'prosemirror-transform';

import * as wrapper from '../transform';

const internalFunctions = [
  // see: https://github.com/ProseMirror/prosemirror-transform/blob/477972474d9fdc8648d1afe3e5a07afe9db5f1bd/src/index.ts#L3
  'TransformError',
];
describe('prosemirror-transform', () => {
  it('should export the same public functions', () => {
    const originalPublicFunctions = Object.keys(original)
      .filter(f => !f.startsWith('__'))
      .filter(f => !internalFunctions.includes(f))
      .sort();
    const wrapperFunctions = Object.keys(wrapper).sort();

    expect(wrapperFunctions).toEqual(originalPublicFunctions);
  });
});
