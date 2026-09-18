import { extractMediaHeaders } from './extractMediaHeaders';
import { RequestError } from './RequestError';
import { type RequestMetadata } from './types';

export function createMapResponseToBlob(
	metadata: RequestMetadata,
): (response: Response) => Promise<Blob> {
	return async (response: Response) => {
		try {
			return await response.blob();
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
