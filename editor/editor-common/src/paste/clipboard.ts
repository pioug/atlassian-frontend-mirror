export function checkClipboardTypes(type: DOMStringList | ReadonlyArray<string>, item: string): boolean {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const isDOMStringList = (t: any): t is DOMStringList => !t.indexOf && !!t.contains;
	return isDOMStringList(type) ? type.contains(item) : type.indexOf(item) > -1;
}

export function isPastedFile(rawEvent: ClipboardEvent): boolean {
	const { clipboardData } = rawEvent;
	if (!clipboardData) {
		return false;
	}
	return checkClipboardTypes(clipboardData.types, 'Files');
}
