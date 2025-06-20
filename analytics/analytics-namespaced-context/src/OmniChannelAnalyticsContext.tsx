import { type FunctionComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const OMNI_CHANNEL_CONTEXT = 'omniChannelCtx';

export const OmniChannelAnalyticsContext: FunctionComponent<Props> = createNamespaceContext(
	OMNI_CHANNEL_CONTEXT,
	'OmniChannelAnalyticsContext',
);
