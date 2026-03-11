/**
 * Action Group: tools
 *
 * Actions related to agent tool execution during chat
 * (confirming, streaming, viewing results, errors).
 *
 * ## Adding a new action
 * 1. Add a new variant to the `ToolsEventPayload` union type below with a data-portal link
 * 2. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */
import type { BaseAgentAnalyticsAttributes } from '../../common/types';

type ToolsExecutionAttributesBase = BaseAgentAnalyticsAttributes & {
	tools: {
		toolId: string;
		toolSource: string;
		resolutionType: string;
	}[];
	singleInstrumentationId: string | undefined;
};

export type ToolsEventPayload =
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97675
			actionSubject: 'rovoAgent';
			action: 'toolsExecutionConfirmed';
			attributes: ToolsExecutionAttributesBase;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97750
			actionSubject: 'rovoAgent';
			action: 'toolsExecutionStreamStopped';
			attributes: ToolsExecutionAttributesBase;
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97751
			actionSubject: 'rovoAgent';
			action: 'toolsExecutionResultViewed';
			attributes: ToolsExecutionAttributesBase & {
				scenarioId: string | null | undefined;
			};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/97752
			actionSubject: 'rovoAgent';
			action: 'toolsExecutionResultError';
			attributes: ToolsExecutionAttributesBase;
	  };
