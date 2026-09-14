export function extractMediaHeaders(response: Response): {
	mediaRegion: string;
	mediaEnv: string;
} {
	const { headers } = response;
	const mediaRegion = headers.get('x-media-region') || 'unknown';
	const mediaEnv = headers.get('x-media-env') || 'unknown';

	return { mediaRegion, mediaEnv };
}
