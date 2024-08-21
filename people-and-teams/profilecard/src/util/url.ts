export const encodeParamsToUrl = (
	baseUrl: string,
	params: Record<string, string | number | boolean>,
): string => {
	const url = new URL(baseUrl);
	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		searchParams.append(key, String(value));
	}
	url.search = searchParams.toString();
	return url.toString();
};
