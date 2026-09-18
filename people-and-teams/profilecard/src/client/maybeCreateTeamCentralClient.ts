import { isFedRamp } from '@atlaskit/atlassian-context/is-fedramp';

import { type ClientOverrides } from '../types';
import {
	default as TeamCentralCardClient,
	type TeamCentralCardClientOptions,
} from './TeamCentralCardClient';

export function maybeCreateTeamCentralClient(
	config: TeamCentralCardClientOptions,
	clients?: ClientOverrides,
): TeamCentralCardClient | undefined {
	if (isFedRamp()) {
		return undefined;
	}

	if (clients?.teamCentralClient) {
		return clients.teamCentralClient;
	}
	const teamCentralEnabled = config.teamCentralDisabled !== true;
	return teamCentralEnabled ? new TeamCentralCardClient({ ...config }) : undefined;
}
