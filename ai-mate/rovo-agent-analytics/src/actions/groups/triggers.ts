/**
 * Action Group: triggers
 *
 * Inline agent trigger views and successful create, update, enable/disable and delete operations.
 *
 * ## Adding a new action
 * 1. Add a new variant to the `TriggerEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */
import type { BaseAgentAnalyticsAttributes } from '../../common/types';

type ExistingTriggerAttributes = {
	automationRuleId: string;
};

type TriggerFormViewAttributes =
	| { flow: 'create' }
	| (ExistingTriggerAttributes & { flow: 'edit' });

export type TriggerEventPayload = {
	actionSubject: 'rovoAgent';
	attributes: Required<Pick<BaseAgentAnalyticsAttributes, 'agentId' | 'touchPoint'>>;
} & (
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/113348
			action: 'triggerListViewed';
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/113349
			action: 'triggerDetailsViewed';
			attributes: TriggerFormViewAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/113350
			action: 'triggerConfigurationViewed';
			attributes: TriggerFormViewAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/113351
			action: 'triggerCreated';
			attributes: ExistingTriggerAttributes & {
				triggerType: string | null;
				enabled: boolean | null;
			};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/113352
			action: 'triggerUpdated';
			attributes: ExistingTriggerAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/113353
			action: 'triggerEnabledChange';
			attributes: ExistingTriggerAttributes & { enabled: boolean };
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/113354
			action: 'triggerDeleted';
			attributes: ExistingTriggerAttributes;
	  }
);
