import { print } from "graphql";
import gql from "graphql-tag";

export const TeamHasAgentsQuery = print(gql`
    query serviceName_TeamHasAgentsQuery($id: ID!) {
        graphStore @optIn(to: "GraphStore") {
            teamHasAgents(id: $id) @optIn(to: "GraphStoreTeamHasAgents") {
                edges {
                    node {
                        ... on AppUser {
                            id
                            name
                            picture
                        }
                    }
                    cursor
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`);

export type TeamHasAgentsQueryVariable = {
    id: string;
};

export type TeamHasAgentsQueryResponse = {
    teamHasAgents: {
        edges: Array<{
            node: {
                name: string;
                id: string;
                picture?: string
            };
        }>;
    };
};