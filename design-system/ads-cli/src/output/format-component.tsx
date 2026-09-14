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
	status?: string;
	category?: string;
	description?: string;
	usageGuidelines?: string[];
	props?: ComponentProp[];
	examples?: unknown[];
	// Matches `@atlaskit/ads-mcp`'s component shape: `designSource` is an object holding the Figma
	// library link, not a bare string. (Interpolating the object directly rendered `[object Object]`.)
	designSource?: { figmaUrl?: string };
};

import { humanFormat } from '@atlaskit/cli-output/human-format';

/**
 * Render props through the shared terminal table used by Platform CLI. The shared formatter keeps
 * names visually distinct, aligns columns, and bounds long generated type expressions.
 */
const formatProps = (props: ComponentProp[]): string[] =>
	humanFormat.propertyTable(
		props.map((prop) => ({
			name: prop.name ?? '(unknown)',
			type: prop.type,
			description: prop.description,
		})),
	);

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
		return [humanFormat.section(`Example ${index + 1}`), humanFormat.codeBlock(code)].join('\n');
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

	const header = humanFormat.heading(component.name);

	const metadata = humanFormat.metadata([component.status, component.category, component.package]);
	const sections: string[] = [header, ...(metadata ? [metadata] : [])];
	if (component.description) sections.push('', component.description);
	if (component.usageGuidelines?.length) {
		sections.push(
			'',
			humanFormat.section('Use it well'),
			...component.usageGuidelines
				.slice(0, 4)
				.map((item) => `  ${humanFormat.success('•')} ${item}`),
		);
	}
	sections.push('', ...formatProps(component.props ?? []));

	const examples = formatExamples(component.examples ?? []);
	if (examples.length > 0) {
		sections.push('', ...examples);
	}

	// Render the design link from the `figmaUrl` inside `designSource`. Only emit the line when a
	// URL is actually present, so a `designSource` object without a `figmaUrl` doesn't print
	// `Design: undefined`.
	if (component.designSource?.figmaUrl) {
		sections.push(
			'',
			`${humanFormat.section('Design:')} ${humanFormat.action(component.designSource.figmaUrl)}`,
		);
	}

	return sections.join('\n');
};
