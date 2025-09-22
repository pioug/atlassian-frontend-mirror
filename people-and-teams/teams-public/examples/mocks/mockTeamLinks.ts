import fetchMock from 'fetch-mock/cjs/client';


export const mockTeamLinksQueries = {
	data: () =>
		fetchMock.get({
			matcher: (url: string) => url.includes('/gateway/api/v4/teams/') && url.includes('/links'),
			response: () => {
				return {
					entities: [{
						contentTitle: "Google test 1",
						description: "",
						linkId: "a055e56d-d591-4caa-b94b-2b388a1ec187",
						linkUri: "https://www.google.com/",
						teamId: "60262580-19df-4bf7-8388-8638feaa4dfb",
					}],
				};
			},
			name: 'getTeamLinks',
			overwriteRoutes: true,
		}),
};
