#!/usr/bin/env node

import { run } from './cli';
import { CLI_ATLAS_INVOCATION } from './commands/cli-metadata';

/**
 * Process entrypoint for the `atlas ads` distribution.
 *
 * Atlas forwards everything after `atlas ads` as process arguments. The shared CLI owns parsing,
 * output, and its stable exit-code contract; this entrypoint only maps that result onto the plugin
 * process.
 */
export const main = async (argv: string[] = process.argv.slice(2)): Promise<void> => {
	try {
		const exitCode = await run(argv, undefined, { invocation: CLI_ATLAS_INVOCATION });
		process.exitCode = exitCode;
	} catch (error) {
		if (typeof error === 'number') {
			process.exitCode = error;
			return;
		}

		process.stderr.write(
			`${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
		);
		process.exitCode = 1;
	}
};

if (require.main === module) {
	void main();
}
