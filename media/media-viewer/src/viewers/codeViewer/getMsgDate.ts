import { parseHeaders } from './parseHeaders';

export function getMsgDate(rawHeaders: string): Date | '-' {
	const headers = parseHeaders(rawHeaders);
	if (!headers['Date']) {
		return '-';
	}
	return new Date(headers['Date']);
}
