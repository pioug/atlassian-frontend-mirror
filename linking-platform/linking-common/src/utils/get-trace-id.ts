export function getTraceId(response: Response): string | null {
	try {
		return response.headers.get('x-trace-id') ?? response.headers.get('atl-traceid') ?? null;
	} catch {
		return null;
	}
}
