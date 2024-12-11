import { type FireEventFunction } from '../../../common/analytics/types';
import { type CardInnerAppearance } from '../../../view/Card/types';
import { type AnalyticsFacade } from '../../analytics';

export type UseInvokeClientActionProps = {
	/**
	 * Analytics object
	 */
	analytics?: AnalyticsFacade;
	/**
	 * A function to dispatch analytics events.
	 */
	fireEvent?: FireEventFunction;
};

export type InvokeClientActionSubjectId =
	| 'copyLink'
	| 'downloadDocument'
	| 'invokePreviewScreen'
	| 'shortcutGoToLink';

export type InvokeClientActionProps = {
	/**
	 * Invoke action to execute.
	 */
	actionFn: () => Promise<void>;

	/**
	 * Invoke action subject id for analytics purposes.
	 */
	actionSubjectId?: InvokeClientActionSubjectId;

	/**
	 * Invoke action type for analytics purposes.
	 */
	actionType: string;

	/**
	 * Definition id for analytics purposes.
	 */
	definitionId?: string;

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

	/**
	 * ID for analytics purposes.
	 */
	id?: string;

	/**
	 * Resource type for analytics purposes.
	 */
	resourceType?: string;
};

export type InvokeClientActionHandler = (opts: InvokeClientActionProps) => Promise<void>;
