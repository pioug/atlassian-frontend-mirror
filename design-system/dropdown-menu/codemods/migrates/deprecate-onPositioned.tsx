// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRemoveFuncAddCommentFor } from '@atlaskit/codemod-utils';

const deprecateOnPositioned = createRemoveFuncAddCommentFor(
  '@atlaskit/dropdown-menu',
  'onPositioned',
);

export default deprecateOnPositioned;
