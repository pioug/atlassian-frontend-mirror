import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const ELEMENTS_CONTEXT = 'fabricElementsCtx';

export const FabricElementsAnalyticsContext: StatelessComponent<Props> = createNamespaceContext(
  ELEMENTS_CONTEXT,
  'FabricElementsAnalyticsContext',
);
