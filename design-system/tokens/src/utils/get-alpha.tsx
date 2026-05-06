export function getAlpha(hex: string): number {
	if (hex.length === 9) {
		const int = parseInt(hex.slice(7, 9), 16) / 255;
		return Number(parseFloat(int.toString()).toFixed(2));
	}
	return 1;
}
