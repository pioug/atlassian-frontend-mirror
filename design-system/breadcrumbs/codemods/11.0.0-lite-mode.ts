// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { elevateStatelessToDefault } from './migrates/elevate-stateless-to-default';
import { removeHasSeparator } from './migrates/remove-hasSeparator';
import { renameBreadcrumbsStatelessToBreadcrumbs } from './migrates/rename-bread-crumbs-stateless-to-bread-crumbs';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/breadcrumbs', [
  removeHasSeparator,
  elevateStatelessToDefault,
  renameBreadcrumbsStatelessToBreadcrumbs,
]);

export default transformer;
