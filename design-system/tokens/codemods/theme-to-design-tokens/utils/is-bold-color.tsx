export function isBoldColor(color: string): boolean {
	const number = parseInt(color.replace(/^./, ''), 10);
	return number > 300;
}
