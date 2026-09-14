import type { TeamContainers } from '@atlaskit/teams-client/team-containers';
import type { UnlinkContainerMutationError } from '@atlaskit/teams-client/unlink-container-mutation';

import type { ConnectedTeams } from './connected-teams';

export type TeamState = {
	teamContainers: TeamContainers;
	loading: boolean;
	hasLoaded: boolean;
	error: Error | null;
	unlinkError: UnlinkContainerMutationError | null;
	teamId: string | null;
	connectedTeams: ConnectedTeams;
};
