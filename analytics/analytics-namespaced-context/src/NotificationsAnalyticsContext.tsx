import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const NOTIFICATIONS_CONTEXT = 'NotificationsCtx';

export const NotificationsAnalyticsContext: StatelessComponent<Props> = createNamespaceContext(
  NOTIFICATIONS_CONTEXT,
  'NotificationsAnalyticsContext',
);
