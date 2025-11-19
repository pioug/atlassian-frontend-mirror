import type { JSX } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const GROWTH_CONTEXT = 'editionAwarenessCtx';

export const GrowthAnalyticsContext: {
	(props: Props): JSX.Element;
	displayName: string;
} = createNamespaceContext<Props>(GROWTH_CONTEXT, 'GrowthAnalyticsContext');
