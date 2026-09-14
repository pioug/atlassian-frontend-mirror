export function isFetchResponse(data: unknown): data is { response: Response } {
	if (!data || !(data as any).hasOwnProperty('response')) {
		return false;
	}
	return (data as { response: unknown }).response instanceof Response;
}
