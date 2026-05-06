export function splitAtIndex(text: string, index: number): [string, string] {
	return [text.slice(0, index), text.slice(index)];
}
