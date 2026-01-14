import { print } from 'graphql';
import gql from 'graphql-tag';

export const HelpPointerDeleteMutation: string = print(gql`
	mutation DeleteHelpPointer($id: ID!) {
		deleteHelpPointer(input: { id: $id }) {
			success
		}
	}
`);

export type HelpPointerDeleteMutationVariables = {
	id: string;
};

export type HelpPointerDeleteMutationResponse = {
	success: boolean;
};
