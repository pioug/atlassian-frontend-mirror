import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const NAVIGATION_CONTEXT = 'navigationCtx';

export const NavigationAnalyticsContext: FunctionComponent<Props> = createNamespaceContext(
	NAVIGATION_CONTEXT,
	'NavigationAnalyticsContext',
);
