/**
 * Human-readable renderer for a single "doc object" payload — the shape returned by the
 * accessibility (`docs a11y`) and migration (`docs migration`) tools.
 *
 * These tools return a structured object (title, description, and several labelled lists such
 * as `guidelines`, `bestPractices`, `nextSteps`). The default output prints this as readable text
 * rather than raw JSON; `--json` still exposes the full structured payload.
 */

/**
 * Convert a camelCase / snake_case field key into a human "Title Case" heading,
 * e.g. `bestPractices` → `Best Practices`, `additionalResources` → `Additional Resources`.
 */
const humanizeKey = (key: string): string =>
	key
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase())
		.trim();

/**
 * Collapse whitespace so list items and inline values stay readable on their own lines.
 */
const oneLine = (text: string): string => text.replace(/\s+/g, ' ').trim();

/**
 * Render a single list item. Strings are collapsed to one line. Objects that look like a code
 * example (`title` + `code`/`before`/`after`) are rendered as a titled fenced block so the
 * snippet stays copy-pasteable; any other object falls back to compact JSON so no data is lost.
 */
const formatListItem = (item: unknown): string => {
	if (typeof item === 'string') {
		return `  - ${oneLine(item)}`;
	}

	if (item !== null && typeof item === 'object') {
		const record = item as Record<string, unknown>;
		const title = typeof record.title === 'string' ? record.title : null;
		const code = ['code', 'before', 'after'].find((key) => typeof record[key] === 'string');

		if (title && code) {
			const description =
				typeof record.description === 'string' ? `\n    ${oneLine(record.description)}` : '';
			return `  - ${title}${description}\n    \`\`\`tsx\n${record[code] as string}\n    \`\`\``;
		}
		if (title) {
			return `  - ${title}`;
		}
	}

	// Unknown object shape: keep the data rather than drop it.
	return `  - ${JSON.stringify(item)}`;
};

/**
 * Keys that identify the record or provide its header/description — rendered as the header or
 * skipped, never as their own labelled section. `message` is the header used by the "index"
 * response the a11y tool returns when no topic is supplied (it has no `title`).
 */
const IDENTITY_KEYS = new Set(['topic', 'migration', 'title', 'message', 'description']);

/**
 * Render a doc-object payload as readable text. Handles both the full guide shape (a11y guidance,
 * migration guide — keyed by `title`) and the topic-index shape the a11y tool returns when no
 * topic is given (keyed by `message` + `availableTopics`). Returns `null` when the data is not a
 * recognisable doc object so the caller can fall back to generic rendering.
 */
export const formatDocObject = (data: unknown): string | null => {
	if (data === null || typeof data !== 'object' || Array.isArray(data)) {
		return null;
	}

	const record = data as Record<string, unknown>;

	// Derive a header from `title` (full guide) or `message` (topic index). Without either, this
	// is not a doc object we can render sensibly, so defer to the generic fallback.
	const header = typeof record.title === 'string' ? record.title : record.message;
	if (typeof header !== 'string' || !header) {
		return null;
	}

	const sections: string[] = [header, '='.repeat(header.length)];

	if (typeof record.description === 'string' && record.description) {
		sections.push('', oneLine(record.description));
	}

	// Render every remaining field in declaration order: strings as `Label: value`, arrays as a
	// labelled bulleted list. Identity/header fields are skipped (handled above).
	for (const [key, value] of Object.entries(record)) {
		if (IDENTITY_KEYS.has(key)) {
			continue;
		}

		const label = humanizeKey(key);

		if (Array.isArray(value)) {
			if (value.length === 0) {
				continue;
			}
			sections.push('', `${label}:`, ...value.map(formatListItem));
		} else if (typeof value === 'string' && value) {
			sections.push('', `${label}: ${oneLine(value)}`);
		}
	}

	return sections.join('\n');
};
