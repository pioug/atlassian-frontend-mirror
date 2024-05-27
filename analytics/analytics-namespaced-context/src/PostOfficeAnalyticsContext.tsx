import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const POST_OFFICE_CONTEXT = 'postOfficeCtx';

export const PostOfficeAnalyticsContext: FunctionComponent<Props> =
  createNamespaceContext(POST_OFFICE_CONTEXT, 'PostOfficeAnalyticsContext');
