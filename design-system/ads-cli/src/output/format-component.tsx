/**
 * Human-readable renderer for a single ADS component's detailed docs.
 *
 * Renders the `component <Name>` view: a readable header, a props table, and the usage examples —
 * instead of dumping the raw JSON payload. Full structured data (including the `designSource` link
 * and untruncated types) remains available via `--json`.
 */

/**
 * One prop entry as returned by `searchComponentsTool`. Only the fields the detailed view needs
 * are modelled; anything else is ignored.
 */
type ComponentProp = {
	name?: string;
	type?: string;
	description?: string;
};

/**
 * A component payload as returned by `searchComponentsTool` / `getAllComponentsTool`.
 */
type ComponentPayload = {
	name?: string;
	package?: string;
	props?: ComponentProp[];
	examples?: unknown[];
	// Matches `@atlaskit/ads-mcp`'s component shape: `designSource` is an object holding the Figma
	// library link, not a bare string. (Interpolating the object directly rendered `[object Object]`.)
	designSource?: { figmaUrl?: string };
};

/**
 * Collapse whitespace/newlines in a prop description so each prop stays on one readable line.
 */
const oneLine = (text: string): string => text.replace(/\s+/g, ' ').trim();

/**
 * Render the props section as an aligned two-column list: `name  type`, with the description on
 * a wrapped continuation line. Returns an empty array when there are no props.
 */
const formatProps = (props: ComponentProp[]): string[] => {
	if (props.length === 0) {
		return ['Props: none'];
	}

	// Align the type column to the longest prop name for readability.
	const longestName = props.reduce((max, prop) => Math.max(max, (prop.name ?? '').length), 0);

	const rows = props.flatMap((prop) => {
		const name = (prop.name ?? '(unknown)').padEnd(longestName);
		const type = prop.type ? oneLine(prop.type) : '';
		const header = `  ${name}  ${type}`.trimEnd();
		const description = prop.description ? `      ${oneLine(prop.description)}` : null;
		return description ? [header, description] : [header];
	});

	return [`Props (${props.length}):`, ...rows];
};

/**
 * Render the examples section. Each example is a code snippet string; they are printed verbatim
 * inside a fenced block so they can be copy-pasted.
 */
const formatExamples = (examples: unknown[]): string[] => {
	if (examples.length === 0) {
		return [];
	}

	const blocks = examples.map((example, index) => {
		const code = typeof example === 'string' ? example : JSON.stringify(example, null, 2);
		return [`Example ${index + 1}:`, '```tsx', code, '```'].join('\n');
	});

	return [`Examples (${examples.length}):`, '', ...blocks];
};

/**
 * Render a single component payload as detailed, human-readable docs. Returns `null` when the
 * data is not a recognisable component object, so the caller can fall back to generic rendering.
 */
export const formatComponent = (data: unknown): string | null => {
	// `component <name>` reuses component search with limit 1, so `data` is a one-element array.
	const component: ComponentPayload | undefined = Array.isArray(data)
		? (data[0] as ComponentPayload | undefined)
		: (data as ComponentPayload);

	if (!component || typeof component !== 'object' || typeof component.name !== 'string') {
		return null;
	}

	const header = component.package ? `${component.name}  (${component.package})` : component.name;

	const sections: string[] = [
		header,
		'='.repeat(header.length),
		'',
		...formatProps(component.props ?? []),
	];

	const examples = formatExamples(component.examples ?? []);
	if (examples.length > 0) {
		sections.push('', ...examples);
	}

	// Render the design link from the `figmaUrl` inside `designSource`. Only emit the line when a
	// URL is actually present, so a `designSource` object without a `figmaUrl` doesn't print
	// `Design: undefined`.
	if (component.designSource?.figmaUrl) {
		sections.push('', `Design: ${component.designSource.figmaUrl}`);
	}

	return sections.join('\n');
};
