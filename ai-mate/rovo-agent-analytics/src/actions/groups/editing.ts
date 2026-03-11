/**
 * Action Group: editing
 *
 * Agent editing/mutation events — fired when an agent's configuration is saved or modified.
 * Unlike agentInteractions (user clicks), these track actual data changes.
 *
 * ## Adding a new action
 * 1. Add a new variant to the `EditingEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit editing/mutation events, create a new group file instead
 *    (see other files in this directory for the template)
 */
import type { BaseAgentAnalyticsAttributes } from '../../common/types';

export type EditingEventPayload = {
	// https://data-portal.internal.atlassian.com/analytics/registry/97122
	actionSubject: 'rovoAgent';
	action: 'updated';
	attributes: BaseAgentAnalyticsAttributes & {
		agentType: string;
		field: string;
	};
};
