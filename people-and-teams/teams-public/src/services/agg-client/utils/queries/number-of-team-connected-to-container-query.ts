import { print } from 'graphql';
import gql from 'graphql-tag';

export const NumberOfTeamConnectedToContainerQuery = print(gql`
	query getNumberOfTeamsForContainer($containerId: ID!) {
		graphStore @optIn(to: "GraphStore") {
			teamConnectedToContainerInverse(id: $containerId, consistentRead: true)
				@optIn(to: "GraphStoreTeamConnectedToContainer") {
				edges {
					id
				}
			}
		}
	}
`);

export type NumberOfTeamConnectedToContainerQueryVariables = {
	containerId: string;
};

export type NumberOfTeamConnectedToContainerQueryResponse = {
	teamConnectedToContainerInverse: {
		edges: {
			id: string;
		}[];
	};
};
