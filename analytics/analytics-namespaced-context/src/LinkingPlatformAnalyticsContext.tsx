import { FunctionComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const LINKING_PLATFORM_CONTEXT = 'linkingPlatformCtx';

export const LinkingPlatformAnalyticsContext: FunctionComponent<Props> =
  createNamespaceContext(
    LINKING_PLATFORM_CONTEXT,
    'LinkingPlatformAnalyticsContext',
  );
