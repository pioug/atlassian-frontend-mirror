import type { BaseAgentAnalyticsAttributes } from '../../common/types';

/** Agent profile screen event for both modal and page presentations. */
export type AgentProfileEventPayload = {
	eventType: 'screen';
	name: 'viewAgentProfile';
	action?: never;
	actionSubject?: never;
	attributes: BaseAgentAnalyticsAttributes;
};
