import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const TOWNSQUARE_HOME_CONTEXT = 'townsquareHomeCtx';

export const TownsquareHomeAnalyticsContext: FunctionComponent<Props> = createNamespaceContext(
	TOWNSQUARE_HOME_CONTEXT,
	'TownsquareHomeAnalyticsContext',
);
