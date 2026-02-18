const parseRetryAfter = (retryAfter: string) => {
	let newDelay;

	// retryAfter can either be in ms or HTTP date
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
	await new Promise((resolve) =>
		setTimeout(resolve, (retryAfter ? parseRetryAfter(retryAfter) : undefined) ?? delay),
	);

	return fetchWithRetry(url, options, retriesRemaining - 1, delay * 2);
};
