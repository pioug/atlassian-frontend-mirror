import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const LINKING_PLATFORM_CONTEXT = 'linkingPlatformCtx';

export const LinkingPlatformAnalyticsContext: FunctionComponent<Props> =
  createNamespaceContext(
    LINKING_PLATFORM_CONTEXT,
    'LinkingPlatformAnalyticsContext',
  );
