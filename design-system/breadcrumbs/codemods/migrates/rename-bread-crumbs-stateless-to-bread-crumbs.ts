// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { createRenameJSXFunc } from '../utils';

export const renameBreadcrumbsStatelessToBreadcrumbs = createRenameJSXFunc(
  '@atlaskit/breadcrumbs',
  'BreadcrumbsStateless',
  'Breadcrumbs',
  'DSBreadcrumbs',
);
