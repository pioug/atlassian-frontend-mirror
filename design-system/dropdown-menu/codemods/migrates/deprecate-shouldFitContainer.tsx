// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRemoveFuncAddCommentFor } from '@atlaskit/codemod-utils';

const deprecateShouldFitContainer = createRemoveFuncAddCommentFor(
  '@atlaskit/dropdown-menu',
  'shouldFitContainer',
);

export default deprecateShouldFitContainer;
