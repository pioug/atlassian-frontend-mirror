import { FunctionComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const AI_MATE_CONTEXT = 'aiMateCtx';

export const AIMateAnalyticsContext: FunctionComponent<Props> =
  createNamespaceContext(AI_MATE_CONTEXT, 'AIMateAnalyticsContext');
