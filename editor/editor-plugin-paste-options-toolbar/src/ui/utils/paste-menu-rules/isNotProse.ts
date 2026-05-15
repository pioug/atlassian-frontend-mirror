export const isNotProse = (text: string): boolean => {
	const trimmed = text.trim();
	if (!trimmed) {
		return false;
	}

	// Check each character: if we find whitespace it's prose-like,
	// if we find a non-ASCII character it's likely CJK/Thai/etc.
	for (let i = 0; i < trimmed.length; i++) {
		const code = trimmed.charCodeAt(i);
		// Whitespace (space, tab, newline, etc.) → prose-like
		if (code === 0x20 || code === 0x09 || code === 0x0a || code === 0x0d) {
			return false;
		}
		// Non-ASCII character → likely a non-Latin script (CJK, Thai, etc.)
		if (code > 0x7f) {
			return false;
		}
	}

	// No whitespace and all ASCII → URL, token, path, etc.
	return true;
};
