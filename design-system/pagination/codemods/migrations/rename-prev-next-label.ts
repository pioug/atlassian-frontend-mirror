import { createRenameFuncFor } from '@atlaskit/codemod-utils';

export const renameNextProp = createRenameFuncFor(
  '@atlaskit/pagination',
  'next',
  'nextLabel',
);
export const renamePrevProp = createRenameFuncFor(
  '@atlaskit/pagination',
  'prev',
  'prevLabel',
);
