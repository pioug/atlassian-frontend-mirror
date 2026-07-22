/**
 * Human-readable rendering of a successful command result.
 */

import chalk from 'chalk';

import type { Writer } from './writer';

/**
 * Emit a human-readable rendering of a successful result to stdout.
 *
 * Structured data is pretty-printed as JSON (the underlying tools already return rich
 * objects), while plain-string payloads such as guideline markdown are printed verbatim.
 */
export const writeHumanResult = ({ data, writer }: { data: unknown; writer: Writer }): void => {
	if (typeof data === 'string') {
		writer.out(data);
		return;
	}
	if (data === null || data === undefined) {
		writer.err(chalk.yellow('No results.'));
		return;
	}
	writer.out(JSON.stringify(data, null, 2));
};
