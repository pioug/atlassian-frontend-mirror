/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

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

/**
 * @deprecated Use `import { useTeamsClientSetupNext } from '@atlaskit/teams-client/use-teams-client-setup-next'` instead.
 */
export { useTeamsClientSetupNext } from './use-teams-client-setup-next';
