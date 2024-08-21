import { useCallback } from 'react';

import { getATLContextUrl } from '@atlaskit/atlassian-context';

import { encodeParamsToUrl } from '../../util/url';

export const useAgentUrlActions = ({ cloudId }: { cloudId: string }) => {
	const onEditAgent = useCallback(
		(agentId: string) => {
			const url = `${getATLContextUrl('home')}/chat/agents/${agentId}/edit?cloudId=${cloudId}`;
			window.open(url, '_blank', 'noopener, noreferrer');
		},
		[cloudId],
	);

	const onCopyAgent = useCallback(
		(agentId: string) => {
			const baseUrl = `${getATLContextUrl('home')}/chat`;
			const urlWithParams = encodeParamsToUrl(baseUrl, {
				cloudId,
				pathway: 'chat',
				agentId,
			});
			navigator.clipboard.writeText(urlWithParams);
		},
		[cloudId],
	);

	const onDuplicateAgent = useCallback(
		(agentId: string) => {
			const baseUrl = `${getATLContextUrl('home')}/chat/agents/new`;
			const urlWithParams = encodeParamsToUrl(baseUrl, {
				cloudId,
				pathway: 'agents-create',
				agentId,
			});

			window.open(urlWithParams, '_blank', 'noopener, noreferrer');
		},
		[cloudId],
	);

	return {
		onEditAgent,
		onCopyAgent,
		onDuplicateAgent,
	};
};
