import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const RECENT_WORK_CONTEXT = 'RecentWorkCtx';

export const RecentWorkAnalyticsContext: StatelessComponent<Props> =
  createNamespaceContext(RECENT_WORK_CONTEXT, 'RecentWorkAnalyticsContext');
