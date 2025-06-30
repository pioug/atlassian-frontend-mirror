// Reusable TextEncoder instance to avoid creating new instances
const textEncoder = new TextEncoder();

export default function getPayloadSize(payload: object): number {
	// Early return for null/undefined to avoid unnecessary processing
	if (!payload) {
		return 0;
	}

	// Use the reusable encoder instance
	return Math.round(textEncoder.encode(JSON.stringify(payload)).length / 1024);
}
