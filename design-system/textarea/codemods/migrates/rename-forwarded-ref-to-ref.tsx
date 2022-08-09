import { createRenameFuncFor } from '../utils';

export const renameForwardedRefToRef = createRenameFuncFor(
  '@atlaskit/textarea',
  'forwardedRef',
  'ref',
);
