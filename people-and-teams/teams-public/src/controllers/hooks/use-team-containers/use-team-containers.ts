import { useCallback, useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';
import type { TeamWithMemberships } from '@atlaskit/teams-client/membership';
import type { TeamContainers } from '@atlaskit/teams-client/team-containers';
import type { UnlinkContainerMutationError } from '@atlaskit/teams-client/unlink-container-mutation';

import { type TeamContainer } from '../../../common/types';
import { useTeamContainers as useTeamContainersMulti } from './use-team-containers-2';
import { useTeamContainersHook } from './use-team-containers-hook';

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
	const [state, actions] = useTeamContainersHook();
	const useMultiTeam = fg('enable_multi_team_containers_state');
	const multiTeamResult = useTeamContainersMulti(teamId, useMultiTeam ? enable : false);
	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		if (enable && !useMultiTeam) {
			actions.fetchTeamContainers(teamId, fireEvent);
		}
	}, [teamId, actions, enable, fireEvent, useMultiTeam]);

	const refetchTeamContainers = useCallback(
		async (): Promise<void> => actions.refetchTeamContainers(fireEvent),
		[actions, fireEvent],
	);

	if (useMultiTeam) {
		return multiTeamResult;
	}

	return {
		...state,
		addTeamContainer: actions.addTeamContainer,
		unlinkTeamContainers: (containerId: string) =>
			actions.unlinkTeamContainers(teamId, containerId),
		refetchTeamContainers,
	};
};
