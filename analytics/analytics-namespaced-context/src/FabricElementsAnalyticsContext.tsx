import { FunctionComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const ELEMENTS_CONTEXT = 'fabricElementsCtx';

export const FabricElementsAnalyticsContext: FunctionComponent<Props> =
  createNamespaceContext(ELEMENTS_CONTEXT, 'FabricElementsAnalyticsContext');
