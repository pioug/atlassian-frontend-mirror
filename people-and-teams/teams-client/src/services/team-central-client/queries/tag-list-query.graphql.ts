import { print } from 'graphql';
import gql from 'graphql-tag';

export const TagListQuery = print(gql`
	query TagListByCloudId($q: String!, $cloudId: String!, $first: Int) {
		tagSearchByCloudId(q: $q, cloudId: $cloudId, first: $first) {
			edges {
				node {
					id
					uuid
					name
					projects {
						count
					}

					goals {
						count
					}

					helpLinks {
						count
					}
				}
			}
		}
	}
`);

export type TagListQueryVariables = {
	q: string;
	cloudId: string;
	first?: number;
};

export type TagListQueryResponse = {
	edges: {
		node: {
			id: string;
			uuid: string;
			name: string;
			projects: {
				count: number;
			};
			goals: {
				count: number;
			};
			helpLinks: {
				count: number;
			};
		};
	}[];
};
