import { print } from 'graphql';
import gql from 'graphql-tag';

export const TeamContainersQueryV2: string = print(gql`
	query TeamContainersQueryV2($cypherQuery: String!, $params: JSON!) {
		graphStore @optIn(to: ["GraphStore", "GraphStoreCypherQueryV2"]) {
			cypherQueryV2(query: $cypherQuery, params: $params) {
				edges {
					node {
						columns {
							key
							value {
								... on GraphStoreCypherQueryV2AriNode {
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
										... on LoomSpace {
											id
											loomSpaceName: name
											url
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`);

export type TeamContainersQueryV2Variables = {
	cypherQuery: string;
	params: Record<string, any>;
};

export type TeamContainersQueryV2Response = {
	cypherQueryV2: {
		edges: Array<{
			node: {
				columns: Array<{
					key: string;
					value: {
						data?: JiraProject | ConfluenceSpace | LoomSpace;
					};
				}>;
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

type LoomSpace = {
	__typename: 'LoomSpace';
	id: string;
	loomSpaceName: string;
	url: string;
};
