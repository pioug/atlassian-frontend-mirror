import { useCallback } from 'react';

import { getATLContextUrl } from '@atlaskit/atlassian-context';
import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers';

import { encodeParamsToUrl } from '../../../util/url';

export const firstCharUpper = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const ROVO_PARAM_PREFIX = 'rovoChat';
const createRovoParams = (params: {
	agentId?: string;
	cloudId?: string;
	pathway?: string;
	conversationId?: string;
	prompt?: string;
}) => {
	const rovoParams: Record<string, string> = {};
	Object.entries(params).forEach(([key, value]) => {
		rovoParams[`${ROVO_PARAM_PREFIX}${firstCharUpper(key)}`] = encodeURIComponent(value);
	});
	return rovoParams;
};

export const useAgentUrlActions = ({ cloudId }: { cloudId: string }) => {
	const { publishWithPostMessage } = useRovoPostMessageToPubsub();

	const onEditAgent = useCallback(
		(agentId: string) => {
			const url = `${getATLContextUrl('home')}/chat/agents/${agentId}/edit`;
			const urlWithParams = encodeParamsToUrl(url, {
				cloudId,
				...createRovoParams({ cloudId }),
			});
			window.open(urlWithParams, '_blank', 'noopener, noreferrer');
		},
		[cloudId],
	);

	const onCopyAgent = (agentId: string) => {
		navigator.clipboard.writeText(`${window.location.origin}/people/agent/${agentId}`);
	};

	const onDuplicateAgent = useCallback(
		(agentId: string) => {
			const baseUrl = `${getATLContextUrl('home')}/chat/agents/new`;
			const urlWithParams = encodeParamsToUrl(baseUrl, {
				cloudId,
				...createRovoParams({ cloudId, agentId, pathway: 'agents-create' }),
			});

			window.open(urlWithParams, '_blank', 'noopener, noreferrer');
		},
		[cloudId],
	);

	const onConversationStarter = ({ agentId, prompt }: { agentId: string; prompt: string }) => {
		const startConversationInNewTab = () => {
			const baseUrl = `${getATLContextUrl('home')}/chat`;
			const urlWithParams = encodeParamsToUrl(baseUrl, {
				cloudId,
				...createRovoParams({ cloudId, agentId, prompt, pathway: 'chat' }),
			});
			window.open(urlWithParams, '_blank', 'noopener, noreferrer');
		};

		publishWithPostMessage({
			targetWindow: window,
			payload: {
				type: 'chat-new',
				source: 'AgentProfileCard',
				data: {
					name: prompt.slice(0, 50),
					prompt,
					agentId,
					dialogues: [],
				},
			},
			onAcknowledgeTimeout: () => {
				startConversationInNewTab();
			},
		});
	};

	const onOpenChat = (agentId: string, agentName: string) => {
		const openChatInNewTab = () => {
			const baseUrl = `${getATLContextUrl('home')}/chat`;
			const urlWithParams = encodeParamsToUrl(baseUrl, {
				cloudId,
				...createRovoParams({ cloudId, agentId }),
			});
			window.open(urlWithParams, '_blank', 'noopener, noreferrer');
		};

		publishWithPostMessage({
			targetWindow: window,
			payload: {
				type: 'chat-new',
				source: 'AgentProfileCard',
				data: {
					agentId,
					dialogues: [],
					name: `Chat with ${agentName}`,
				},
			},
			onAcknowledgeTimeout: () => {
				openChatInNewTab();
			},
		});
	};

	const onViewFullProfile = (agentId: string) => {
		window.open(
			`${window.location.origin}/people/agent/${agentId}`,
			'_blank',
			'noopener, noreferrer',
		);
	};

	return {
		onEditAgent,
		onCopyAgent,
		onDuplicateAgent,
		onOpenChat,
		onConversationStarter,
		onViewFullProfile,
	};
};
