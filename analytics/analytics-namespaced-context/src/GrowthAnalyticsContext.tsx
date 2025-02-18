import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const GROWTH_CONTEXT = 'editionAwarenessCtx';

export const GrowthAnalyticsContext = createNamespaceContext<Props>(
	GROWTH_CONTEXT,
	'GrowthAnalyticsContext',
);
