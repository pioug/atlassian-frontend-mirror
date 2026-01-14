import { print } from 'graphql';
import gql from 'graphql-tag';

export const KudosDeleteMutation: string = print(gql`
	mutation DeleteKudos($id: ID!) {
		deleteKudos(input: { id: $id }) {
			success
			kudos {
				id
			}
		}
	}
`);

export type KudosDeleteMutationVariables = {
	id: string;
};

export type KudosDeleteMutationResponse = {
	success: boolean;
	kudos: {
		id: string;
	};
};
