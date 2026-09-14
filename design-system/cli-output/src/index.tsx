import chalk from 'chalk';

type CodeBlockOptions = { language?: string };
type Property = { name: string; type?: string; description?: string };
export type SearchRow = {
	name: string;
	package?: string;
	source?: string;
	kind?: string;
	metadata?: string[];
	description?: string;
	followUp?: string;
};
const fallbackCodeWidth = 96;
const maximumCodeWidth = 120;

const source = (value: string): string =>
	value === 'ads' ? chalk.magenta('ADS') : chalk.cyan('Platform');
const heading = (value: string): string => chalk.bold.cyan(value);
const section = (value: string): string => chalk.bold(value);
const muted = (value: string): string => chalk.dim(value);
const action = (value: string): string => chalk.cyan(value);
const success = (value: string): string => chalk.green(value);
const failure = (value: string): string => chalk.red(value);
const warning = (value: string): string => chalk.yellow(value);
const property = (value: string): string => chalk.bold.cyan(value);
const metadata = (values: Array<string | null | undefined>): string =>
	values.filter((value): value is string => Boolean(value)).join(`  ${muted('·')}  `);

const oneLine = (value: string): string => value.replace(/\s+/g, ' ').trim();
const truncate = (value: string, maximum = 100): string =>
	value.length > maximum ? `${value.slice(0, maximum - 1)}…` : value;

const wrap = (value: string, width: number): string[] => {
	const words = value.replace(/\s+/g, ' ').trim().split(' ');
	if (words.length === 1 && words[0] === '') return [];
	const lines: string[] = [];
	let current = '';
	for (const word of words) {
		if (!current) {
			current = word;
		} else if (current.length + word.length + 1 <= width) {
			current += ` ${word}`;
		} else {
			lines.push(current);
			current = word;
		}
	}
	if (current) lines.push(current);
	return lines;
};

/**
 * Render the shared discovery row used by ADS and Platform search commands.
 */
const searchRow = (row: SearchRow, index?: number): string => {
	const terminalWidth = process.stdout.columns ? Math.max(process.stdout.columns - 6, 60) : 96;
	const prefix = index === undefined ? '' : `${muted(`${String(index + 1).padStart(2)}.`)} `;
	const title = `${prefix}${heading(row.name)}${row.package ? `  ${muted(row.package)}` : ''}`;
	const sourceLabel = row.source ? source(row.source.toLowerCase()) : undefined;
	const metadata = [sourceLabel, row.kind, ...(row.metadata ?? [])]
		.filter(Boolean)
		.join(`  ${muted('·')}  `);
	const lines = [title];
	if (metadata) lines.push(`   ${muted(metadata)}`);
	if (row.description)
		lines.push(...wrap(row.description, terminalWidth).map((line) => `   ${line}`));
	if (row.followUp) lines.push(`   ${action('→')} ${action(row.followUp)}`);
	return lines.join('\n');
};

const searchRows = (rows: SearchRow[]): string =>
	rows.map((row, index) => searchRow(row, index)).join('\n\n');

/**
 * Render code against a GitHub-dark-like surface. Tabs are displayed as two spaces to keep the
 * terminal preview compact while preserving copy-pasteable source structure. The surface fills
 * the available terminal width where practical, without making short examples excessively wide.
 */
const codeBlock = (code: string, { language = 'tsx' }: CodeBlockOptions = {}): string => {
	const lines = code.trimEnd().replace(/\t/g, '  ').split('\n');
	const terminalWidth = process.stdout.columns
		? Math.min(process.stdout.columns - 4, maximumCodeWidth)
		: fallbackCodeWidth;
	const width = Math.max(terminalWidth, language.length, ...lines.map((line) => line.length));
	const surface = (line: string, decorate: (value: string) => string = (value) => value): string =>
		chalk.bgHex('#161b22')(`  ${decorate(line)}${' '.repeat(Math.max(width - line.length, 0))}  `);
	return [surface(language, chalk.bold.cyan), ...lines.map((line) => surface(line))].join('\n');
};

/**
 * Render concise, aligned offering properties without letting deeply nested types dominate.
 */
const propertyTable = (properties: Property[]): string[] => {
	if (properties.length === 0) {
		return [section('Props: none')];
	}
	const nameWidth = Math.max(...properties.map((entry) => entry.name.length));
	const rows = properties.flatMap((entry) => {
		const name = property(entry.name.padEnd(nameWidth));
		const type = entry.type ? truncate(oneLine(entry.type)) : muted('unknown');
		const description = entry.description ? `  ${muted(oneLine(entry.description))}` : null;
		return description ? [`  ${name}  ${type}`, description] : [`  ${name}  ${type}`];
	});
	return [section(`Props (${properties.length})`), ...rows];
};

/**
 * The one terminal presentation capability shared by ADS CLI and Platform CLI.
 */
export const humanFormat: {
	source: typeof source;
	heading: typeof heading;
	section: typeof section;
	muted: typeof muted;
	action: typeof action;
	success: typeof success;
	failure: typeof failure;
	warning: typeof warning;
	property: typeof property;
	metadata: typeof metadata;
	codeBlock: typeof codeBlock;
	propertyTable: typeof propertyTable;
	searchRow: typeof searchRow;
	searchRows: typeof searchRows;
} = {
	source,
	heading,
	section,
	muted,
	action,
	success,
	failure,
	warning,
	property,
	metadata,
	codeBlock,
	propertyTable,
	searchRow,
	searchRows,
};
