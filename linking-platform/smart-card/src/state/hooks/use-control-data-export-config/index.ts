import { useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context';
import type { EnvironmentsKeys } from '@atlaskit/linking-common/types';

import { type ControlDataExportConfig } from './types';

export const useControlDataExportConfig = (): ControlDataExportConfig => {
	const { connections, product, shouldControlDataExport } = useSmartLinkContext();

	return useMemo(
		() => ({
			baseUrl: connections.client.baseUrlOverride,
			envKey: connections.client.envKey as EnvironmentsKeys,
			product,
			shouldControlDataExport,
		}),
		[
			connections.client.baseUrlOverride,
			connections.client.envKey,
			product,
			shouldControlDataExport,
		],
	);
};
