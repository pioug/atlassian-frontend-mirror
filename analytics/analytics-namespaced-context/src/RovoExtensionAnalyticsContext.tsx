import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const ROVO_EXTENSION_CONTEXT = 'rovoExtensionCtx';

export const RovoExtensionAnalyticsContext: FunctionComponent<Props> = createNamespaceContext(
	ROVO_EXTENSION_CONTEXT,
	'RovoExtensionAnalyticsContext',
);