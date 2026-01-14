import { print } from 'graphql';
import gql from 'graphql-tag';

export const RemoveTeamWatcherMutation: string = print(gql`
	mutation removeTeamWatcher($teamId: String!, $cloudId: String) {
		removeTeamWatcher(input: { teamId: $teamId, cloudId: $cloudId }) {
			isWatching
			__typename
		}
	}
`);

export type RemoveTeamWatcherMutationVariables = {
	teamId: string;
	cloudId?: string;
};

export type RemoveTeamWatcherMutationResponse = {
	isWatching: boolean;
	__typename: 'removeTeamWatcherPayload';
};
