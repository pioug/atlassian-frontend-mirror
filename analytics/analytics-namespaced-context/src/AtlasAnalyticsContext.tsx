import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const ATLAS_CONTEXT = 'atlasCtx';

export const AtlasAnalyticsContext: FunctionComponent<Props> =
  createNamespaceContext(ATLAS_CONTEXT, 'AtlasAnalyticsContext');
