// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRemoveFuncFor } from '../utils';

export const removeHasSeparator = createRemoveFuncFor(
  '@atlaskit/breadcrumbs',
  'BreadcrumbsItem',
  'hasSeparator',
  (j, element) => j(element).find(j.JSXSpreadAttribute).length > 0,
  `This file uses the @atlaskit/breadcrumbs \`hasSeparator\` prop which
      has now been removed due to its poor performance characteristics. From version 11.0.0, we changed to
      \`css\` pseudo element for the separator and consumer should not use hasSeparator directly anymore.`,
);
