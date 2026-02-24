import { fg } from '@atlaskit/platform-feature-flags';
import { functionWithCondition } from '@atlaskit/platform-feature-flags-react';

const MAX_RETRY_DELAY = 30000;

const parseRetryAfterBase = (retryAfter: string) => {
	let newDelay;

	// retryAfter can either be in seconds or HTTP date
	const parsedRetryAfter = parseInt(retryAfter);
	if (!isNaN(parsedRetryAfter)) {
		newDelay = parsedRetryAfter * 1000;
	} else {
		const retryDate = new Date(retryAfter);
		const delayFromDate = retryDate.getTime() - Date.now();
		if (delayFromDate > 0) {
			newDelay = delayFromDate;
		}
	}

	return newDelay;
};

const parseRetryAfterPatched = (retryAfter: string): number | undefined => {
	// retryAfter can either be in seconds or HTTP date
	const parsedRetryAfter = parseInt(retryAfter, 10);
	if (!isNaN(parsedRetryAfter) && parsedRetryAfter > 0) {
		return parsedRetryAfter * 1000;
	}

	const retryDate = new Date(retryAfter);
	if (isNaN(retryDate.getTime())) {
		return undefined;
	}
	const delayFromDate = retryDate.getTime() - Date.now();
	if (delayFromDate > 0) {
		return delayFromDate;
	}

	return undefined;
};

const parseRetryAfter = functionWithCondition(
	() => fg('platform_synced_block_patch_4'),
	parseRetryAfterPatched,
	parseRetryAfterBase,
);

export const fetchWithRetry = async (
	url: string,
	options: RequestInit,
	retriesRemaining = 3,
	delay = 1000,
): Promise<Response> => {
	const response = await fetch(url, options);

	const shouldRetry = !response.ok && response.status === 429 && retriesRemaining > 1;
	if (!shouldRetry) {
		return response;
	}

	const retryAfter = response.headers.get('Retry-After');
	const parsedDelay = (retryAfter ? parseRetryAfter(retryAfter) : undefined) ?? delay;
	const retryDelay = fg('platform_synced_block_patch_4')
		? Math.min(parsedDelay, MAX_RETRY_DELAY)
		: parsedDelay;
	await new Promise((resolve) => setTimeout(resolve, retryDelay));

	return fetchWithRetry(url, options, retriesRemaining - 1, delay * 2);
};
