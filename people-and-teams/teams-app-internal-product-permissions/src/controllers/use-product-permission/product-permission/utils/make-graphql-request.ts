export const makeGraphqlRequest = ({
	url,
	query,
	variables,
}: {
	url: string;
	query: string;
	variables?: object;
}): Promise<Response> => {
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});
};
