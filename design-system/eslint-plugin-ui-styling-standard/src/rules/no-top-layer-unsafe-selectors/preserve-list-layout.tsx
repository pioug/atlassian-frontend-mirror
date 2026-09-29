import selectorParser from 'postcss-selector-parser';

/**
 * Split a selector list on its top-level commas only, keeping the whitespace and comments
 * around each branch exactly as written. Commas inside `(…)`, `[…]`, quotes, comments and
 * escapes belong to their branch, because the parser already knows which commas separate
 * branches and which do not.
 *
 * Returns `null` when the text does not parse, or when the branches do not join back into the
 * original text, so the caller falls back to the transform's own text rather than re-assembling
 * a list it cannot fully account for.
 */
function splitTopLevel({ text }: { text: string }): string[] | null {
	try {
		const root = selectorParser().astSync(text);
		const parts = root.nodes.map((branch) => branch.toString());
		if (parts.join(',') !== text) {
			return null;
		}
		return parts;
	} catch {
		return null;
	}
}

/**
 * Re-apply the author's layout of a selector list to the rewritten one.
 *
 * The transform joins its branches with `, `. A selector list written over several lines would
 * be collapsed onto one by the fixer, so each rewritten branch is put back between the
 * separators the author wrote. Falls back to the transform's text when either list does not
 * split cleanly, or when the two do not have the same number of branches.
 */
export function preserveListLayout({
	original,
	rewritten,
}: {
	original: string;
	rewritten: string;
}): string {
	const originalParts = splitTopLevel({ text: original });
	const rewrittenParts = splitTopLevel({ text: rewritten });

	if (originalParts === null || rewrittenParts === null) {
		return rewritten;
	}
	if (originalParts.length < 2 || originalParts.length !== rewrittenParts.length) {
		return rewritten;
	}

	return originalParts
		.map((part, index) => {
			const leading = part.length - part.trimStart().length;
			const trailing = part.length - part.trimEnd().length;
			return `${part.slice(0, leading)}${rewrittenParts[index].trim()}${part.slice(
				part.length - trailing,
			)}`;
		})
		.join(',');
}
