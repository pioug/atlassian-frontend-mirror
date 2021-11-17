// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRemoveFuncAddCommentFor } from '@atlaskit/codemod-utils';

const deprecateOnItemActivated = createRemoveFuncAddCommentFor(
  '@atlaskit/dropdown-menu',
  'onItemActivated',
);

export default deprecateOnItemActivated;
