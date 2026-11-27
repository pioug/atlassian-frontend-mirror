// All Editor instances share these registry-defined identities for the lifetime of the page load.
const seen = new Set<string>();

export function isFirstOccurrenceOnPageLoad(identity: string): boolean {
	const first = !seen.has(identity);
	seen.add(identity);
	return first;
}
