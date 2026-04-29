export function padToTwo(number: number): string {
	return number <= 99 ? `0${number}`.slice(-2) : `${number}`;
}
