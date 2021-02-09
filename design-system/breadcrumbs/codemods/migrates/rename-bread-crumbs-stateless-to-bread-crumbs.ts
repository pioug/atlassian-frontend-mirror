import { createRenameJSXFunc } from '../utils';

export const renameBreadcrumbsStatelessToBreadcrumbs = createRenameJSXFunc(
  '@atlaskit/breadcrumbs',
  'BreadcrumbsStateless',
  'Breadcrumbs',
  'DSBreadcrumbs',
);
