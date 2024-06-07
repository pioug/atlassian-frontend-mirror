const access = {
	'urn:filestore:collection:MediaServicesSample': ['read', 'insert'],
	'urn:filestore:chunk:*': ['create', 'read'],
	'urn:filestore:upload': ['create'],
	'urn:filestore:upload:*': ['read', 'update'],
	'urn:filestore:file': ['create'],
	'urn:filestore:file:*': ['read', 'update'],
	'urn:filestore:collection': ['create'],
	'urn:filestore:collection:mediapicker-test': ['read', 'insert'],
};

export const getAuthFromContextProvider = async () => {
	const url = 'https://media-playground.dev.atl-paas.net/token/tenant?environment=asap';
	const body = JSON.stringify({
		access,
	});
	const headers = new Headers();

	headers.append('Content-Type', 'application/json; charset=utf-8');
	headers.append('Accept', 'text/plain, */*; q=0.01');

	const response = await fetch(url, {
		method: 'POST',
		body,
		headers,
	});

	return response.json();
};
