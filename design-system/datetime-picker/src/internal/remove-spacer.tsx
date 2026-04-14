export function removeSpacer(time: string): string {
	return time.replace(/[:.]/g, '');
}
