import { useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import type { EnvironmentsKeys } from '@atlaskit/linking-common/types';

import { type AISummaryConfig } from './types';

export const useAISummaryConfig = (): AISummaryConfig => {
	const { connections, product, isAdminHubAIEnabled } = useSmartLinkContext();

	return useMemo(
		() => ({
			baseUrl: connections.client.baseUrlOverride,
			envKey: connections.client.envKey as EnvironmentsKeys,
			product,
			isAdminHubAIEnabled,
		}),
		[connections.client.baseUrlOverride, connections.client.envKey, product, isAdminHubAIEnabled],
	);
};
