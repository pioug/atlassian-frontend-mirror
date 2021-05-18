import { createRemoveFuncAddCommentFor } from '@atlaskit/codemod-utils';
const comment = `Pagination i18n prop has now been removed and we have tried to flatten its child prev & next as a standalone props.
There may be cases in which codemod might not automatically flat i18n prop of Pagination and have to be handled manually.`;

export const removeI18nProps = createRemoveFuncAddCommentFor(
  '@atlaskit/pagination',
  'i18n',
  comment,
);
