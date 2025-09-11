import { print } from 'graphql';
import gql from 'graphql-tag';

export const IsTeamWatcherQuery = print(gql`
	query IsTeamWatcher($teamId: String!, $cloudId: String!) {
		isTeamWatcher: teamByTeamId(teamId: $teamId, cloudId: $cloudId) {
			watching
		}
	}
`);

export type IsTeamWatcherQueryVariables = {
	teamId: string;
	cloudId: string;
};

export type IsTeamWatcherQueryResponse = {
	watching: boolean;
};
