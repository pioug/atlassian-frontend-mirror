/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of this deprecated API. */

import { useTeamsClientSetupNext } from './use-teams-client-setup-next';

/**
 * @deprecated use useTeamsClientSetupNext for named parameters
 */
export const useTeamsClientSetup = (
	stargateRoot?: string,
	cloudId?: string | null,
	orgId?: string,
	principalUserId?: string,
): void => {
	useTeamsClientSetupNext({
		stargateRoot,
		cloudId,
		orgId,
		principalUserId,
	});
};
