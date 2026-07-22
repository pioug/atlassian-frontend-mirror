import { parseArgs } from '../parse-args';

describe('parseArgs', () => {
	it('extracts the command as the first positional', () => {
		const result = parseArgs(['search', 'avatar']);
		expect(result.command).toBe('search');
		expect(result.positionals).toEqual(['avatar']);
	});

	it('collects multiple positional terms', () => {
		const result = parseArgs(['search', 'button', 'modal', 'select']);
		expect(result.positionals).toEqual(['button', 'modal', 'select']);
	});

	it('parses a single-value flag and its value', () => {
		const result = parseArgs(['search', 'avatar', '--limit', '5']);
		expect(result.positionals).toEqual(['avatar']);
		expect(result.flags.limit).toBe('5');
	});

	it('supports the --flag=value form', () => {
		const result = parseArgs(['search', 'avatar', '--limit=3']);
		expect(result.flags.limit).toBe('3');
	});

	it('resolves short aliases to canonical flag names', () => {
		expect(parseArgs(['-h']).flags.help).toBe(true);
		expect(parseArgs(['-v']).flags.version).toBe(true);
		expect(parseArgs(['search', 'x', '-l', '2']).flags.limit).toBe('2');
		expect(parseArgs(['search', 'x', '-t', 'tokens']).flags.type).toBe('tokens');
	});

	it('records an unknown flag as a bare boolean without consuming the next token', () => {
		const result = parseArgs(['lint-rules', 'token', '--not-a-real-flag']);
		expect(result.flags['not-a-real-flag']).toBe(true);
		expect(result.positionals).toEqual(['token']);
	});

	it('treats --json as a global boolean', () => {
		expect(parseArgs(['search', 'avatar', '--json']).flags.json).toBe(true);
	});

	it('parses --all as a boolean without consuming the next token', () => {
		const result = parseArgs(['token', '--all']);
		expect(result.flags.all).toBe(true);
		expect(result.positionals).toEqual([]);
	});

	it('records an empty string when a value flag is given no value', () => {
		const result = parseArgs(['search', 'avatar', '--limit']);
		expect(result.flags.limit).toBe('');
	});

	it('returns an undefined command when argv is empty', () => {
		const result = parseArgs([]);
		expect(result.command).toBeUndefined();
		expect(result.positionals).toEqual([]);
	});
});
