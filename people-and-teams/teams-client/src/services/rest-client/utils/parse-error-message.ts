import { type RestJsonErrorResponse } from '../../../common/utils/error';

export async function parseErrorMessage(response: Response): Promise<string> {
	let json: RestJsonErrorResponse;
	const text = await response.text();

	try {
		json = JSON.parse(text);
	} catch (err) {
		return text;
	}

	delete json.timestamp; // to dedupe sentry, scrub non-unique 'timestamp' field from the error body

	if (json.error) {
		return `${json.status || 'UNKNOWN_STATUS'} ${json.error || 'MISSING_ERROR_MESSAGE'}`;
	} else if (json.status) {
		return `${json.status} MISSING_ERROR_MESSAGE`;
	} else if (json.errors) {
		const errs: string[] = json.errors.map((error): string =>
			typeof error === 'string' ? error : error.code || error.message || 'MISSING_ERROR_MESSAGE',
		);

		return errs.join('\n - ');
	}

	return JSON.stringify(json);
}
