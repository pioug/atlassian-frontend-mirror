import { type InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';

import { type PreviewActionData } from '../../flexible-ui-context/types';
import type { InvokeClientActionProps } from '../use-invoke-client-action/types';

/**
 * Additional details for invoke function that may be required for component
 */
export type CardDetails = {
	/**
	 * An identifier for Smart Link analytics
	 */
	id?: string;
	/**
	 * A open embed modal action to invoke with useInvokeClientAction
	 */
	invokePreviewAction?: InvokeClientActionProps;
	/**
	 * The URL of the Smart Link
	 */
	url?: string;

	/**
	 * Preview Modal information. If present, will be used to render an embed modal on an error link click
	 * TODO: Remove on cleanup of platform-smart-card-migrate-embed-modal-analytics
	 */
	previewData?: PreviewActionData | null;
};

/**
 * Additional details to reload smart links
 */
export type InvokeReloadDetails = {
	/**
	 * An identifier for Smart Link analytics
	 */
	id?: string;
	/**
	 * The URL of the Smart Link
	 */
	url?: string;
};

/**
 * Invoke request with additional details for the component
 */
export type InvokeRequestWithCardDetails = InvokeRequest & {
	details?: CardDetails;
	reload?: InvokeReloadDetails;
};

/**
 * CRUD invoke requests for the component that support server actions
 */
export type InvokeActions = {
	create?: InvokeRequest;
	read?: InvokeRequest;
	update?: InvokeRequestWithCardDetails;
	delete?: InvokeRequest;
};
