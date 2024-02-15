import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const POST_OFFICE_CONTEXT = 'postOfficeCtx';

export const PostOfficeAnalyticsContext: StatelessComponent<Props> =
  createNamespaceContext(POST_OFFICE_CONTEXT, 'PostOfficeAnalyticsContext');
