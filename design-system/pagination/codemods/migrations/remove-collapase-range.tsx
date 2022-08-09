import { createRemoveFuncAddCommentFor } from '@atlaskit/codemod-utils';

const component = '@atlaskit/pagination';
const prop = 'collapseRange';

const comment = `Pagination collapseRange prop has now been removed to achieve more performance.
We have not replaced 'collapseRange' with an equivalent API due to its minimal usage and prevent unwanted customisation.
As an alternate, can look for similar customistation via existing 'components' or 'renderEllipsis' prop`;

export const removeCollapseRange = createRemoveFuncAddCommentFor(
  component,
  prop,
  comment,
);
