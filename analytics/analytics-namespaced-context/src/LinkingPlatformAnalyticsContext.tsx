import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const LINKING_PLATFORM_CONTEXT = 'linkingPlatformCtx';

export const LinkingPlatformAnalyticsContext: StatelessComponent<Props> =
  createNamespaceContext(
    LINKING_PLATFORM_CONTEXT,
    'LinkingPlatformAnalyticsContext',
  );
