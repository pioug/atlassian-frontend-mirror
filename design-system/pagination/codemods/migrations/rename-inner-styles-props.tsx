import { createRenameFuncFor } from '@atlaskit/codemod-utils';

export const renameInnerStylesProps = createRenameFuncFor(
  '@atlaskit/pagination',
  'innerStyles',
  'style',
);
