/**
 * Action Group: agentInteractions
 *
 * User-initiated interactions with an agent — typically from the overflow menu ("...")
 * or agent profile surfaces (viewing, editing, deleting, duplicating, starring, sharing, verifying).
 *
 * NOTE: This is about UI interactions, not backend "actions" (which are being replaced by "tools").
 *
 * ## Adding a new action
 * 1. Add a new variant to the `AgentInteractionsEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit user interactions, create a new group file instead
 *    (see other files in this directory for the template)
 */
import type { BaseAgentAnalyticsAttributes } from '../../common/types';

/**
 * Discriminated union payload type for agent interaction events.
 * Use with `trackAgentEvent()`.
 */
export type AgentInteractionsEventPayload =
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97125
			actionSubject: 'rovoAgent';
			action: 'view';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97126
			actionSubject: 'rovoAgent';
			action: 'edit';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97128
			actionSubject: 'rovoAgent';
			action: 'copyLink';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97129
			actionSubject: 'rovoAgent';
			action: 'delete';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97130
			actionSubject: 'rovoAgent';
			action: 'duplicate';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97133
			actionSubject: 'rovoAgent';
			action: 'star';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97095
			actionSubject: 'rovoAgent';
			action: 'chat';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97134
			actionSubject: 'rovoAgent';
			action: 'verify';
			attributes: BaseAgentAnalyticsAttributes;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97135
			actionSubject: 'rovoAgent';
			action: 'unverify';
			attributes: BaseAgentAnalyticsAttributes;
	  };
