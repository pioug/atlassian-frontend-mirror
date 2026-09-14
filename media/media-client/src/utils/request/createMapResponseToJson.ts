import { RequestError } from './RequestError';
import { extractMediaHeaders } from './extractMediaHeaders';
import { type RequestMetadata } from './types';

export function createMapResponseToJson(
	metadata: RequestMetadata,
): (response: Response) => Promise<any> {
	return async (response: Response) => {
		try {
			return await response.json();
		} catch (err) {
			throw new RequestError(
				'serverInvalidBody',
				{
					...metadata,
					...extractMediaHeaders(response),
					statusCode: response.status,
				},
				err instanceof Error ? err : undefined,
			);
		}
	};
}
