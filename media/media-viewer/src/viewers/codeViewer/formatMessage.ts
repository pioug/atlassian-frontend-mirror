export function formatMessage(text: string): string {
	const lines = text.trim().split('\n');
	let maxLineLength = 0;
	lines.forEach((line: string) => (maxLineLength = Math.max(line.length, maxLineLength)));

	const border = '*'.repeat(maxLineLength + 10);
	text = `${border}\n`;
	text += lines.map((line: string) => ` ${line}`).join('\n');
	text += `\n${border}\n`;
	return text;
}
