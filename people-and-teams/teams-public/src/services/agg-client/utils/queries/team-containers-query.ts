import { print } from 'graphql';
import gql from 'graphql-tag';

export const TeamContainersQuery = print(gql`
	query TeamContainersQuery($cypherQuery: String!) {
		graphStore @optIn(to: ["GraphStore"]) {
			cypherQuery(query: $cypherQuery) @optIn(to: ["GraphStoreCypherQuery"]) {
				edges {
					__typename
					node {
						from {
							id
						}
						to {
							id
							data {
								__typename
								... on ConfluenceSpace {
									id
									confluenceSpaceName: name
									type
									createdDate
									links {
										base
										webUi
									}
									icon {
										path
									}
								}
								... on JiraProject {
									id
									jiraProjectName: name
									webUrl
									created
									avatar {
										medium
									}
									projectType
									projectTypeName
								}
							}
						}
					}
				}
			}
		}
	}
`);

export type TeamContainersQueryVariables = {
	cypherQuery: string;
};

export type TeamContainersQueryResponse = {
	cypherQuery: {
		edges: Array<{
			node: {
				from: {
					id: string;
				};
				to: {
					id: string;
					data: JiraProject | ConfluenceSpace;
				};
			};
		}>;
	};
};

type JiraProject = {
	__typename: 'JiraProject';
	id: string;
	jiraProjectName: string;
	webUrl: string;
	created: string;
	avatar: {
		medium: string;
	};
	projectType: string;
	projectTypeName: string;
};

type ConfluenceSpace = {
	__typename: 'ConfluenceSpace';
	id: string;
	confluenceSpaceName?: string;
	type: string;
	createdDate: string;
	links: {
		base: string;
		webUi: string;
	};
	icon: {
		path: string;
	};
};
