export const URL_QUERY_PARAM_INTERACTION_SESSION = 'xpis';

export const generateUrlWithParams = (
	url: string,
	bridge: string,
	interactionSessionId: string,
	product: string,
	subProduct?: string,
): string => {
	const interactionSource = subProduct ? `${product}-${subProduct}` : product;

	const interactionSession = {
		bridge: bridge,
		id: interactionSessionId,
		source: interactionSource,
	};

	const paramValueEncoded = btoa(JSON.stringify(interactionSession));

	let partialUrl = false;
	let urlObj;

	// If relative URL provided, add localhost as placeholder base, to be stripped later
	try {
		urlObj = new URL(url);
	} catch {
		urlObj = new URL(url, 'http://localhost/');
		partialUrl = true;
	}

	urlObj.searchParams.set(URL_QUERY_PARAM_INTERACTION_SESSION, paramValueEncoded);

	if (partialUrl) {
		return urlObj.pathname + urlObj.search;
	} else {
		return urlObj.toString();
	}
};
