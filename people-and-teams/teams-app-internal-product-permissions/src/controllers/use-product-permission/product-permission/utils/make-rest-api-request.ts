export const makeRestApiRequest = ({
	url,
	body,
}: {
	url: string;
	body?: string;
}): Promise<Response> => {
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	});
};
