import { useContext } from 'react';

import BreadcrumbsSizeContext, { type BreadcrumbsSize } from './breadcrumbs-size-context';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export function useBreadcrumbsSize(): BreadcrumbsSize {
	return useContext(BreadcrumbsSizeContext);
}
