export function parseResponse(response: Response): Promise<any> | null {
	const responseStatusCode = response.status;
	if (responseStatusCode === 204 || responseStatusCode === 202) {
		return null;
	}

	const contentType = response.headers.get('content-type');
	if (!contentType || contentType.includes('text/html') || contentType.includes('text/plain')) {
		return response.text();
	}

	if (contentType.includes('application/json')) {
		return response.json();
	}

	return null;
}
