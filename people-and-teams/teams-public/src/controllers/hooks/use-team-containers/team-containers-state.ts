import type { TeamContainers } from '@atlaskit/teams-client/team-containers';
import type { UnlinkContainerMutationError } from '@atlaskit/teams-client/unlink-container-mutation';

import type { ConnectedTeams } from './connected-teams';

/**
 * State shape for the single-team `teamContainersStore`.
 *
 * Distinct from the multi-team `State` in `./state`, which keys every field by team id.
 */
export type TeamContainersState = {
	teamContainers: TeamContainers;
	loading: boolean;
	hasLoaded: boolean;
	error: Error | null;
	unlinkError: UnlinkContainerMutationError | null;
	teamId: string | null;
	connectedTeams: ConnectedTeams;
};
