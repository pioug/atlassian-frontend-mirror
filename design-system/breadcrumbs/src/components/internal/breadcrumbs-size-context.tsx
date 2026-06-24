import { type Context, createContext } from 'react';

export type BreadcrumbsSize = 'medium' | 'small';

/**
 * Shared breadcrumbs size context for the primitives API and refreshed composed breadcrumbs.
 */
const BreadcrumbsSizeContext: Context<BreadcrumbsSize> = createContext<BreadcrumbsSize>('medium');

export default BreadcrumbsSizeContext;
