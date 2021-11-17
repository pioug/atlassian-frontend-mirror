// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRemoveFuncAddCommentFor } from '@atlaskit/codemod-utils';

const deprecateItems = createRemoveFuncAddCommentFor(
  '@atlaskit/dropdown-menu',
  'items',
);

export default deprecateItems;
