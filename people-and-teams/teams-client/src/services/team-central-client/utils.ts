export const getTeamCentralGraphqlUrl = (baseUrl: string, cloudId: string) =>
	`${baseUrl}/townsquare/s/${cloudId}/graphql`;
export const getUnshardedTeamCentralGraphqlUrl = (baseUrl: string) =>
	`${baseUrl}/watermelon/graphql`;
