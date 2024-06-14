import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const AVP_CONTEXT = 'avpCtx';

export const AVPAnalyticsContext: FunctionComponent<Props> = createNamespaceContext(
	AVP_CONTEXT,
	'AVPAnalyticsContext',
);
