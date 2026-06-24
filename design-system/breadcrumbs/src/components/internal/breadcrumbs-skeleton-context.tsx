import { type Context, createContext } from 'react';

export interface BreadcrumbsSkeletonContextValue {
	isShimmering: boolean;
	size: 'medium' | 'small';
}

/**
 * Shared context for `BreadcrumbsSkeleton` and `BreadcrumbsSkeletonItem`,
 * providing the current size and shimmering state.
 */
export const BreadcrumbsSkeletonContext: Context<BreadcrumbsSkeletonContextValue> =
	createContext<BreadcrumbsSkeletonContextValue>({
		isShimmering: true,
		size: 'medium',
	});
