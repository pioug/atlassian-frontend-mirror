import type { Provider } from 'react';

import BreadcrumbsSizeContext, { type BreadcrumbsSize } from './breadcrumbs-size-context';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const BreadcrumbsSizeProvider: Provider<BreadcrumbsSize> = BreadcrumbsSizeContext.Provider;
