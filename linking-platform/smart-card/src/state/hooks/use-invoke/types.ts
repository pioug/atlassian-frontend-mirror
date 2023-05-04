import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';
import { PreviewActionData } from '../../flexible-ui-context/types';

/**
 * Additional details for invoke function that may be required for component
 */
export type CardDetails = {
  /**
   * An identifier for Smart Link analytics
   */
  id?: string;
  /**
   * The URL of the Smart Link
   */
  url?: string;

  /**
   * Preview Modal information. If present, will be used to render an embed modal on an error link click
   */
  previewData?: PreviewActionData | null;
};

/**
 * Invoke request with additional details for the component
 */
export type InvokeRequestWithCardDetails = InvokeRequest & {
  details?: CardDetails;
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
