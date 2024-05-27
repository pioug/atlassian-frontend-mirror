import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const RECENT_WORK_CONTEXT = 'RecentWorkCtx';

export const RecentWorkAnalyticsContext: FunctionComponent<Props> =
  createNamespaceContext(RECENT_WORK_CONTEXT, 'RecentWorkAnalyticsContext');
