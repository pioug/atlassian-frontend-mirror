/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { type MessageDescriptor } from 'react-intl';

export type ConversationStarter = { message: string; type: ConversationStarterType };

type ConversationStarterType = 'static' | 'user-defined' | 'llm-generated';

export type StaticAgentConversationStarter = {
	message: MessageDescriptor;
	type: ConversationStarterType;
};

/**
 * @deprecated Use `import { getConversationStarters } from '@atlaskit/rovo-agent-components/get-conversation-starters'` instead.
 */
// eslint-disable-next-line no-barrel-files/no-barrel-files -- VOLTC-139 tracks removal of this deprecated re-export shim.
export { getConversationStarters } from './getConversationStarters';
/**
 * @deprecated Use `import { AgentConversationStarters } from '@atlaskit/rovo-agent-components/agent-conversation-starters'` instead.
 */
// eslint-disable-next-line no-barrel-files/no-barrel-files -- VOLTC-139 tracks removal of this deprecated re-export shim.
export { AgentConversationStarters } from './AgentConversationStarters';
// eslint-disable-next-line no-barrel-files/no-barrel-files -- VOLTC-139 tracks removal of this deprecated re-export shim.
export type { AgentConversationStartersProps } from './AgentConversationStarters';
/**
 * @deprecated Use `import { ConversationStarters } from '@atlaskit/rovo-agent-components/conversation-starters'` instead.
 */
// eslint-disable-next-line no-barrel-files/no-barrel-files -- VOLTC-139 tracks removal of this deprecated re-export shim.
export { ConversationStarters } from './ConversationStarters';
// eslint-disable-next-line no-barrel-files/no-barrel-files -- VOLTC-139 tracks removal of this deprecated re-export shim.
export type { ConversationStartersProps } from './ConversationStarters';
