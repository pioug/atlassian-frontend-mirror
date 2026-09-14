export const buildHeaders = (): Headers => {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');

	return headers;
};
