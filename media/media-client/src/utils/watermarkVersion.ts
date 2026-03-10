interface JwtWatermarkPayload {
	watermark?: string;
}

interface WatermarkData {
	v?: string;
	ari?: string;
}

/**
 * Extracts the watermark version string from a JWT auth token.
 *
 * The token payload may contain a `watermark` field, which is a JSON-encoded
 * string like `{"v":"WjtFdA","ari":"ari:cloud:confluence:..."}`.
 *
 * Returns the `v` value if present, or `undefined` if the token has no
 * watermark or cannot be decoded.
 */
export function getWatermarkVersionFromToken(token: string): string | undefined {
	try {
		const parts = token.split('.');
		if (parts.length < 2) {
			return undefined;
		}
		const payload: JwtWatermarkPayload = JSON.parse(
			atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
		);
		if (!payload.watermark) {
			return undefined;
		}
		const watermarkData: WatermarkData = JSON.parse(payload.watermark);
		return watermarkData.v;
	} catch {
		return undefined;
	}
}
