import { useCallback } from 'react';

import { getATLContextUrl } from '@atlaskit/atlassian-context/get-atl-context-url';
import { fg } from '@atlaskit/platform-feature-flags';
import { useRovoPostMessageToPubsub } from '@atlaskit/rovo-triggers/post-message-to-pubsub';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics';

import { encodeParamsToUrl } from '../../../util/url';
import {
	getAtlassianStudioAgentDuplicateUrl,
	getAtlassianStudioAgentEditUrl,
	getStudioPath,
} from '../utils';

import {
	fetchHasVersionCapability,
	fetchActivationId,
	fetchDuplicateAgentMutation,
} from './duplicateFetch';

export const firstCharUpper = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
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

export const useAgentUrlActions = ({
	cloudId,
	email,
	source,
}: {
	cloudId: string;
	email?: string;
	source: string;
}): {
	onEditAgent: (agentId: string) => void;
	onCopyAgent: (agentId: string) => void;
	onDuplicateAgent: (agentId: string) => Promise<void>;
	onOpenChat: (agentId: string, agentName: string) => void;
	onConversationStarter: ({ agentId, prompt }: { agentId: string; prompt: string }) => void;
	onViewFullProfile: (agentId: string) => void;
} => {
	const { publishWithPostMessage } = useRovoPostMessageToPubsub();
	const { fireEvent } = useAnalyticsEvents();

	const onEditAgent = useCallback(
		(agentId: string): void => {
			const url = getAtlassianStudioAgentEditUrl(cloudId, agentId, email);

			window.open(url, '_blank', 'noopener, noreferrer');

			fireEvent('ui.button.clicked.editAgentButton', {
				agentId,
				source,
			});
		},
		[cloudId, email, fireEvent, source],
	);

	const onCopyAgent = (agentId: string): void => {
		const url = `${window.location.origin}/people/agent/${agentId}`;
		const urlWithParams = encodeParamsToUrl(url, {
			cloudId,
		});
		navigator.clipboard.writeText(urlWithParams);

		fireEvent('ui.button.clicked.copyAgentLinkButton', {
			agentId,
			source,
		});
	};

	const onDuplicateAgent = useCallback(
		async (agentId: string): Promise<void> => {
			fireEvent('ui.button.clicked.duplicateAgentButton', {
				agentId,
				source,
			});

			const legacyDuplicateUrl = getAtlassianStudioAgentDuplicateUrl(cloudId, agentId, email);

			// When versioning FG is off, use legacy duplicate flow
			if (!fg('rovo_agent_versioning_enabled')) {
				window.open(legacyDuplicateUrl, '_blank', 'noopener, noreferrer');
				return;
			}

			// Check if versioning migration has completed for this site
			const hasVersionCapability = await fetchHasVersionCapability(cloudId);
			if (!hasVersionCapability) {
				// Opening in same tab because, we cannot open in new tab after async operation, because browsers prevent `.open` after certain duration
				window.location.assign(legacyDuplicateUrl);
				return;
			}

			// Resolve agent ARI (profilecard doesn't have agentAri, so fetch activationId)
			const activationId = await fetchActivationId(cloudId);
			if (!activationId) {
				// Opening in same tab because, we cannot open in new tab after async operation, because browsers prevent `.open` after certain duration
				window.location.assign(legacyDuplicateUrl);
				return;
			}
			const agentAri = `ari:cloud:rovo::agent/activation/${activationId}/${agentId}`;

			// Call BE mutation to duplicate the agent
			const result = await fetchDuplicateAgentMutation(agentAri);
			if (result.success && result.newAgentAri) {
				// Opening in same tab because, we cannot open in new tab after async operation, because browsers prevent `.open` after certain duration
				window.location.assign(
					getStudioPath(
						`/s/${cloudId}/agents/${encodeURIComponent(result.newAgentAri)}/v/draft/details`,
					),
				);
			} else {
				// Fallback to legacy on error
				// Opening in same tab because, we cannot open in new tab after async operation, because browsers prevent `.open` after certain duration
				window.location.assign(legacyDuplicateUrl);
			}
		},
		[cloudId, email, fireEvent, source],
	);

	const onConversationStarter = ({
		agentId,
		prompt,
	}: {
		agentId: string;
		prompt: string;
	}): void => {
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

	const onOpenChat = (agentId: string, agentName: string): void => {
		const openChatInNewTab = () => {
			const baseUrl = `${getATLContextUrl('home')}/chat`;
			const urlWithParams = encodeParamsToUrl(baseUrl, {
				cloudId,
				...createRovoParams({ cloudId, agentId, pathway: 'chat' }),
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

	const onViewFullProfile = (agentId: string): void => {
		const { onNavigate } = navigateToTeamsApp({
			type: 'AGENT',
			payload: {
				agentId,
			},
			cloudId,
			shouldOpenInSameTab: false,
		});

		if (fg('platform-adopt-teams-nav-config')) {
			onNavigate();
		} else {
			window.open(
				`${window.location.origin}/people/agent/${agentId}`,
				'_blank',
				'noopener, noreferrer',
			);
		}

		fireEvent('ui.button.clicked.viewAgentFullProfileButton', {
			agentId,
			source,
		});
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
