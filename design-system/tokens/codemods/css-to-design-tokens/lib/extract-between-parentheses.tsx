export function extractBetweenParentheses(value: string): string {
	const match = value.match(/\((.*?)\)/);
	return match ? match[1] : '';
}
