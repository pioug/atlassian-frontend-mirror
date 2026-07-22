/**
 * Lightweight, dependency-free argument parser for the ADS CLI.
 *
 * We hand-roll parsing (rather than pulling in an argument-parsing library) so that `run(argv)`
 * is deterministic and unit-testable with an explicit argv array, and so the exact flag semantics
 * (value flags vs boolean flags, `--flag=value`, short aliases) stay under our control.
 *
 * The parser produces a normalised {@link ParsedArgs} that the CLI then routes through the
 * command registry.
 */

/**
 * Flags that take a single value (the next token).
 */
const VALUE_FLAGS = new Set(['limit', 'type']);

/**
 * Boolean flags that take no value.
 */
const BOOLEAN_FLAGS = new Set(['json', 'help', 'version', 'all']);

/**
 * Short alias -> canonical flag name.
 */
const ALIASES: Record<string, string> = {
	h: 'help',
	v: 'version',
	l: 'limit',
	t: 'type',
};

export type ParsedArgs = {
	/**
	 * The command name (first non-flag token), or undefined if none was given.
	 */
	command?: string;
	/**
	 * Positional arguments belonging to the command.
	 */
	positionals: string[];
	/**
	 * Parsed flags. Values may be string, number-like string, boolean, or string[].
	 */
	flags: Record<string, unknown>;
};

/**
 * Normalise a raw token like `--limit`, `-l`, or `--json` to its canonical flag name,
 * or `null` if the token is not a flag.
 */
const toFlagName = (token: string): string | null => {
	if (token.startsWith('--')) {
		return token.slice(2);
	}
	if (token.startsWith('-') && token.length > 1) {
		const alias = token.slice(1);
		return ALIASES[alias] ?? alias;
	}
	return null;
};

/**
 * Parse an argv array (already stripped of `node` and the script path) into a normalised
 * command + positionals + flags structure.
 */
export const parseArgs = (argv: string[]): ParsedArgs => {
	const flags: Record<string, unknown> = {};
	const positionals: string[] = [];
	let command: string | undefined;

	for (let index = 0; index < argv.length; index++) {
		const token = argv[index];
		const flagName = toFlagName(token);

		if (flagName === null) {
			// Positional. The very first positional is the command name.
			if (command === undefined) {
				command = token;
			} else {
				positionals.push(token);
			}
			continue;
		}

		// Support `--flag=value` form.
		const equalsIndex = flagName.indexOf('=');
		if (equalsIndex !== -1) {
			const name = flagName.slice(0, equalsIndex);
			flags[name] = flagName.slice(equalsIndex + 1);
			continue;
		}

		if (BOOLEAN_FLAGS.has(flagName)) {
			flags[flagName] = true;
			continue;
		}

		if (VALUE_FLAGS.has(flagName)) {
			const next = argv[index + 1];
			if (next !== undefined && toFlagName(next) === null) {
				flags[flagName] = next;
				index++;
			} else {
				// Flag present with no value; record empty string so the command can report a
				// usage error rather than silently ignoring it.
				flags[flagName] = '';
			}
			continue;
		}

		// Unknown flag: record as a boolean so downstream validation can surface it.
		flags[flagName] = true;
	}

	return { command, positionals, flags };
};
