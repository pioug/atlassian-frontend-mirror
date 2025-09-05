import { useEffect, useState } from 'react';

import { teamsClient } from '../main';
import { logInfoMessage } from '../sentry/main';

/**
 * @deprecated use useTeamsClientSetupNext for named parameters
 */
export const useTeamsClientSetup = (
	stargateRoot?: string,
	cloudId?: string | null,
	orgId?: string,
	principalUserId?: string,
) => {
	useTeamsClientSetupNext({
		stargateRoot,
		cloudId,
		orgId,
		principalUserId,
	});
};

type TeamsClientSetupProps = {
	stargateRoot?: string;
	cloudId?: string | null;
	orgId?: string;
	principalUserId?: string;
};

export const useTeamsClientSetupNext = ({
	stargateRoot,
	cloudId,
	orgId,
	principalUserId,
}: TeamsClientSetupProps) => {
	const [isClientReady, setIsClientReady] = useState(false);

	useEffect(() => {
		if (!stargateRoot) {
			return;
		}
		teamsClient.setBaseUrl(stargateRoot);
	}, [stargateRoot]);

	useEffect(() => {
		teamsClient.setContext({
			cloudId,
			orgId,
			userId: principalUserId,
		});

		if (!orgId) {
			logInfoMessage(`No orgId set - useTeamsClientSetup`, {
				cloudId,
			});
		}

		// Mark client as ready after context is set
		setIsClientReady(true);
	}, [cloudId, orgId, principalUserId]);

	useEffect(() => {
		if (!stargateRoot) {
			return;
		}
		teamsClient.setTeamCentralContext(stargateRoot, {
			cloudId,
			orgId,
			userId: principalUserId,
		});
	}, [cloudId, orgId, principalUserId, stargateRoot]);

	return { isClientReady };
};
