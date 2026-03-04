/**
 * Action Group: tools
 *
 * Actions related to agent tool execution during chat
 * (confirming, streaming, viewing results, errors).
 *
 * ## Adding a new action
 * 1. Add the action to the `AgentToolActions` enum below with a data-portal link
 * 2. Add the corresponding attribute type in `ToolsActionAttributes`
 * 3. If this action doesn't fit this group, consider creating a new group file instead
 *    (see other files in this directory for the template)
 */
import type { BaseAgentAnalyticsAttributes } from '../../common/types';

/** The group name sent as `attributes.actionGroup` in analytics events */
export const ACTION_GROUP = 'tools' as const;

export enum AgentToolActions {
	/* When chatting with an agent, and tools confirmation being shown, then user click proceed with the possible actions (e.g. confirm, dismiss etc) https://data-portal.internal.atlassian.com/analytics/registry/97675 */
	TOOLS_EXECUTION_CONFIRMED = 'toolsExecutionConfirmed',

	/* When tools execution result is being streamed and user stops the stream e.g. by clicking stop button https://data-portal.internal.atlassian.com/analytics/registry/97750 */
	TOOLS_EXECUTION_STREAM_STOPPED = 'toolsExecutionStreamStopped',

	/* When tools execution result is done streaming and user sees the result https://data-portal.internal.atlassian.com/analytics/registry/97751*/
	TOOLS_EXECUTION_RESULT_VIEWED = 'toolsExecutionResultViewed',

	/* When tools execution result streaming fails https://data-portal.internal.atlassian.com/analytics/registry/97752 */
	TOOLS_EXECUTION_RESULT_ERROR = 'toolsExecutionResultError',
}

export type ToolsExecutionAttributes = BaseAgentAnalyticsAttributes & {
	tools: {
		toolId: string;
		toolSource: string;
		resolutionType: string;
	}[];
	singleInstrumentationId: string | undefined;
};

export type ToolsExecutionResultAttributes = ToolsExecutionAttributes & {
	scenarioId: string | null | undefined;
};

export type ToolsActionAttributes = {
	[AgentToolActions.TOOLS_EXECUTION_CONFIRMED]: ToolsExecutionAttributes;
	[AgentToolActions.TOOLS_EXECUTION_STREAM_STOPPED]: ToolsExecutionAttributes;
	[AgentToolActions.TOOLS_EXECUTION_RESULT_VIEWED]: ToolsExecutionResultAttributes;
	[AgentToolActions.TOOLS_EXECUTION_RESULT_ERROR]: ToolsExecutionAttributes;
};
