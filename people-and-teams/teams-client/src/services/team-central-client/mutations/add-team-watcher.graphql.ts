import { print } from 'graphql';
import gql from 'graphql-tag';

export const AddTeamWatcherMutation = print(gql`
	mutation addTeamWatcher($teamId: String!, $cloudId: String) {
		addTeamWatcher(input: { teamId: $teamId, cloudId: $cloudId }) {
			isWatching
			__typename
		}
	}
`);

export type AddTeamWatcherMutationVariables = {
	teamId: string;
	cloudId?: string;
};

export type AddTeamWatcherMutationResponse = {
	isWatching: boolean;
	__typename: 'addTeamWatcherPayload';
};
