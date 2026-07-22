/**
 * Human-readable renderer for a single ADS icon's detail view.
 *
 * The icon dataset provides `componentName`, `package` (the exact subpath entry-point), and a
 * `usage` note. The detail view surfaces the copy-paste `import` line — the actionable thing a
 * consumer needs — alongside the usage guidance. Full structured data remains available via
 * `--json`.
 */

/**
 * An icon payload as returned by `searchIconsTool` / `getAllIconsTool`.
 */
type IconPayload = {
	componentName?: string;
	package?: string;
	usage?: string;
};

/**
 * Collapse whitespace/newlines so the usage note stays readable on its own line.
 */
const oneLine = (text: string): string => text.replace(/\s+/g, ' ').trim();

/**
 * Render a single icon payload as a detail view. Returns `null` when the data is not a
 * recognisable icon object, so the caller can fall back to generic rendering.
 */
export const formatIcon = (data: unknown): string | null => {
	// `icon <name>` reuses icon search with limit 1, so `data` is a one-element array.
	const icon: IconPayload | undefined = Array.isArray(data)
		? (data[0] as IconPayload | undefined)
		: (data as IconPayload);

	if (!icon || typeof icon !== 'object' || typeof icon.componentName !== 'string') {
		return null;
	}

	const sections: string[] = [icon.componentName, '='.repeat(icon.componentName.length)];

	if (icon.package) {
		sections.push('', `Package: ${icon.package}`);
		// The actionable bit: the barrel-correct import for this icon.
		sections.push('', 'Import:', `  import ${icon.componentName} from '${icon.package}';`);
	}

	if (icon.usage) {
		sections.push('', `Usage: ${oneLine(icon.usage)}`);
	}

	return sections.join('\n');
};
