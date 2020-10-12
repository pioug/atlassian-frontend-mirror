import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const NAVIGATION_CONTEXT = 'navigationCtx';

export const NavigationAnalyticsContext: StatelessComponent<Props> = createNamespaceContext(
  NAVIGATION_CONTEXT,
  'NavigationAnalyticsContext',
);
