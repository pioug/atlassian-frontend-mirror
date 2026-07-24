/**
 * A concise documentation match derived from the Markdown returned by `getGuidelinesTool`.
 *
 * Search only surfaces this summary. The `docs` command remains the detail view for the full
 * Markdown content.
 */
export type DocSearchResult = {
	title: string;
	summary?: string;
	followUp: string;
};

/**
 * Truncate a one-line description so compact rows stay on a single line.
 */
const truncate = (text: string, max: number): string =>
	text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

/**
 * Remove common Markdown formatting before showing documentation content in one row.
 */
const toPlainText = (text: string): string =>
	text
		.replace(/!\[[^\]]*]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
		.replace(/^\s{0,3}#{1,6}\s+/gm, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[*_`~]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

/**
 * Turn a full foundations-doc Markdown match into the concise record used by `search`.
 *
 * `getGuidelinesTool` currently returns Markdown rather than structured search metadata. Its
 * highest-ranked match is represented by the query and a preview of its leading textual content;
 * the full payload remains available through the follow-up `docs <query>` command.
 */
export const createDocSearchResults = ({
	data,
	query,
}: {
	data: unknown;
	query: string;
}): DocSearchResult[] => {
	if (typeof data !== 'string' || data.trim() === '') {
		return [];
	}

	const normalizedQuery = query.replace(/\s+/g, ' ').trim();
	const title = normalizedQuery
		? `${normalizedQuery.charAt(0).toUpperCase()}${normalizedQuery.slice(1)}`
		: 'Documentation';
	const preview = toPlainText(data);

	return [
		{
			title: truncate(title, 80),
			...(preview ? { summary: truncate(preview, 100) } : {}),
			followUp: `docs ${query}`,
		},
	];
};
