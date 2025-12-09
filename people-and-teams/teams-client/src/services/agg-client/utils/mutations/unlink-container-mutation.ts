import { print } from 'graphql';
import gql from 'graphql-tag';

export const UnlinkContainerMutation = print(gql`
	mutation unlinkTeamToContainerMutation($teamId: ID!, $containerId: ID!) {
		graphStore @optIn(to: ["GraphStoreMutation"]) {
			deleteTeamConnectedToContainer(
				input: { relationships: [{ from: $teamId, to: $containerId }] }
			) @optIn(to: ["GraphStoreTeamConnectedToContainer"]) {
				errors {
					message
					extensions {
						statusCode
						errorType
					}
				}
				success
			}
		}
	}
`);

export interface UnlinkContainerMutationError extends Error {
	message: string;
	extensions?: {
		statusCode: string;
		errorType: string;
	};
}

export type UnlinkContainerMutationVariables = {
	teamId: string;
	containerId: string;
};

export type UnlinkContainerMutationResponse = {
	deleteTeamConnectedToContainer: {
		errors: Array<UnlinkContainerMutationError>;
		success: boolean;
	};
};
