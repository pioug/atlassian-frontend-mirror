import type { TeamWithMemberships } from '@atlaskit/teams-client/membership';
import type { TeamContainers } from '@atlaskit/teams-client/team-containers';
import type { UnlinkContainerMutationError } from '@atlaskit/teams-client/unlink-container-mutation';

import { type TeamContainer } from '../../../common/types';
import { useTeamContainers as useTeamContainersMulti } from './use-team-containers-2';

export const useTeamContainers = (
	teamId: string,
	enable = true,
): {
	teamContainers: TeamContainers;
	loading: boolean;
	hasLoaded: boolean;
	error: Error | null;
	unlinkError: UnlinkContainerMutationError | null;
	teamId: string | null;
	connectedTeams: {
		containerId: string | undefined;
		isLoading: boolean;
		hasLoaded: boolean;
		teams: TeamWithMemberships[] | undefined;
		error: Error | null;
		numberOfTeams: number | undefined;
	};
	addTeamContainer: (teamContainer: TeamContainer) => void | Promise<void>;
	unlinkTeamContainers: (containerId: string) => void | Promise<void>;
	refetchTeamContainers: () => Promise<void>;
} => {
	return useTeamContainersMulti(teamId, enable);
};
