export function extractPayload(data: Record<string, unknown>): Record<string, unknown> {
	return data.payload !== null && typeof data.payload === 'object'
		? (data.payload as Record<string, unknown>)
		: {};
}
