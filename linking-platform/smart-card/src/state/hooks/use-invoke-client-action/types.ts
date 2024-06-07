import type { AnalyticsFacade } from '../../analytics';
import type { CardInnerAppearance } from '../../../view/Card/types';

export type UseInvokeClientActionProps = {
	/**
	 * Analytics object
	 */
	analytics?: AnalyticsFacade;
};

export type InvokeClientActionProps = {
	/**
	 * Invoke action to execute.
	 */
	actionFn: () => Promise<void>;

	/**
	 * Invoke action type for analytics purposes.
	 */
	actionType: string;

	/**
	 * Smart card display type
	 * This value should already be set in analytics context.
	 * However, we still need to set this value for ufo experience.
	 */
	display?: CardInnerAppearance;

	/**
	 * Link provider extension key
	 * This value should have already been set in analytics object through
	 * useSmartLinkAnalytics() and/or into the analytic context.
	 */
	extensionKey?: string;
};
