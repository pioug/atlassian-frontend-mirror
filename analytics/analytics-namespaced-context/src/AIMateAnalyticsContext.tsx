import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const AI_MATE_CONTEXT = 'aiMateCtx';

export const AIMateAnalyticsContext: FunctionComponent<Props> =
  createNamespaceContext(AI_MATE_CONTEXT, 'AIMateAnalyticsContext');
