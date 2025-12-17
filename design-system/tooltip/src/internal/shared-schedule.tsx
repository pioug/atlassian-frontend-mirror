let delayId: number | null = null;

export function clearScheduled(): void {
	if (delayId != null) {
		window.clearTimeout(delayId);
		delayId = null;
	}
}

export function scheduleTimeout(fn: () => void, delay: number): void {
	clearScheduled();

	delayId = window.setTimeout(() => {
		delayId = null;
		fn();
	}, delay);
}
