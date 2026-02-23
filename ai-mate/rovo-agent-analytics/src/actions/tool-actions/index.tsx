import type { BaseAgentAnalyticsAttributes } from '../../common/types';

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
};
