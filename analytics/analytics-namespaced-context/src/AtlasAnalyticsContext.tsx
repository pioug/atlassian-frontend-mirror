import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const ATLAS_CONTEXT = 'atlasCtx';

export const AtlasAnalyticsContext: StatelessComponent<Props> = createNamespaceContext(
  ATLAS_CONTEXT,
  'AtlasAnalyticsContext',
);
