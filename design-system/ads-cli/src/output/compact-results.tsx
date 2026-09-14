/**
 * Shared compact projections for ADS search and list results.
 *
 * Human-readable rows and `--json` responses both consume these records. Keeping the projection in
 * one place prevents the machine-readable output from silently expanding back to the underlying
 * MCP payload (for example, every component prop and example during discovery).
 */

import type { RowKind } from '../commands/types';

export type CompactComponentResult = {
	name: string;
	package?: string;
	propCount: number;
	exampleCount: number;
	followUp?: string;
};

export type CompactTokenResult = {
	name: string;
	exampleValue?: string;
	followUp?: string;
};

export type CompactIconResult = {
	componentName: string;
	package?: string;
	usage?: string;
	followUp?: string;
};

export type CompactDocResult = {
	title: string;
	summary?: string;
	followUp?: string;
};

export type CompactResult =
	| CompactComponentResult
	| CompactTokenResult
	| CompactIconResult
	| CompactDocResult;

const countOf = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

/**
 * Truncate a one-line value so discovery results stay bounded. Exact detail commands preserve the
 * full value.
 */
const truncateCompactText = (text: string, max = 80): string => {
	const oneLine = text.replace(/\s+/g, ' ').trim();
	return oneLine.length > max ? `${oneLine.slice(0, max - 1).trimEnd()}…` : oneLine;
};

const asRecord = (value: unknown): Record<string, unknown> =>
	value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const optionalString = (value: unknown): string | undefined =>
	typeof value === 'string' && value.length > 0 ? value : undefined;

const withFollowUp = <Result extends object>(
	result: Result,
	showFollowUp: boolean,
	followUp: string,
): Result & { followUp?: string } => (showFollowUp ? { ...result, followUp } : result);

const compactComponent = (value: unknown, showFollowUp: boolean): CompactComponentResult => {
	const record = asRecord(value);
	const name = optionalString(record.name) ?? '(unknown)';
	const propCount = typeof record.propCount === 'number' ? record.propCount : countOf(record.props);
	const exampleCount =
		typeof record.exampleCount === 'number' ? record.exampleCount : countOf(record.examples);

	return withFollowUp(
		{
			name,
			...(optionalString(record.package) ? { package: String(record.package) } : {}),
			propCount,
			exampleCount,
		},
		showFollowUp,
		optionalString(record.followUp) ?? `component ${name}`,
	);
};

const compactToken = (value: unknown, showFollowUp: boolean): CompactTokenResult => {
	const record = asRecord(value);
	const name = optionalString(record.name) ?? '(unknown)';
	const exampleValue = optionalString(record.exampleValue);

	return withFollowUp(
		{
			name,
			...(exampleValue ? { exampleValue: truncateCompactText(exampleValue) } : {}),
		},
		showFollowUp,
		optionalString(record.followUp) ?? `token ${name}`,
	);
};

const compactIcon = (value: unknown, showFollowUp: boolean): CompactIconResult => {
	const record = asRecord(value);
	const componentName = optionalString(record.componentName) ?? '(unknown)';
	const usage = optionalString(record.usage);

	return withFollowUp(
		{
			componentName,
			...(optionalString(record.package) ? { package: String(record.package) } : {}),
			...(usage ? { usage: truncateCompactText(usage) } : {}),
		},
		showFollowUp,
		optionalString(record.followUp) ?? `icon ${componentName}`,
	);
};

const compactDoc = (value: unknown, showFollowUp: boolean): CompactDocResult => {
	const record = asRecord(value);
	const title = optionalString(record.title) ?? '(unknown)';
	const summary = optionalString(record.summary);

	return withFollowUp(
		{
			title,
			...(summary ? { summary: truncateCompactText(summary) } : {}),
		},
		showFollowUp,
		optionalString(record.followUp) ?? `docs ${title.toLowerCase()}`,
	);
};

/**
 * Project raw MCP rows into the compact records shared by human and JSON output. The function is
 * idempotent so batch rendering can safely receive child envelopes that were already compacted.
 */
export const compactResults = ({
	kind,
	data,
	showFollowUp = false,
}: {
	kind: RowKind;
	data: unknown;
	showFollowUp?: boolean;
}): CompactResult[] | null => {
	if (!Array.isArray(data)) {
		return null;
	}

	return data.map((entry) => {
		switch (kind) {
			case 'components':
				return compactComponent(entry, showFollowUp);
			case 'tokens':
				return compactToken(entry, showFollowUp);
			case 'icons':
				return compactIcon(entry, showFollowUp);
			case 'docs':
				return compactDoc(entry, showFollowUp);
		}
	});
};
