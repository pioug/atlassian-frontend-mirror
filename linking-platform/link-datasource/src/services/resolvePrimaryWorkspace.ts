import { request } from '@atlaskit/linking-common/api';

import { type ResolvePrimaryWorkspaceResponse } from '../types/assets/types';

// Resolves the primary Unit workspace via the unit-aware resolver, keyed by the
// current-site cloudId. Gated at the call-site behind
// `astral_units_workspace_host_resolver`.
export const resolvePrimaryWorkspace = async (
	cloudId: string,
): Promise<{ workspaceId: string }> => {
	const url = '/assets/internal/workspace?productContext=confluence';
	const res = await request<ResolvePrimaryWorkspaceResponse>(
		'get',
		url,
		undefined,
		{ 'x-atlassian-cloud-id': cloudId },
		[200],
	);
	if (!res?.linkedAssetsWorkspaceId) {
		throw new Error('Assets workspace resolver returned no workspaceId');
	}
	return { workspaceId: res.linkedAssetsWorkspaceId };
};
