import { useContext } from 'react';

import {
	BreadcrumbsSkeletonContext,
	type BreadcrumbsSkeletonContextValue,
} from './breadcrumbs-skeleton-context';

/**
 * Returns the current `BreadcrumbsSkeleton` context values for child skeleton
 * items, including size and shimmering state.
 */
export function useBreadcrumbsSkeleton(): BreadcrumbsSkeletonContextValue {
	return useContext(BreadcrumbsSkeletonContext);
}
