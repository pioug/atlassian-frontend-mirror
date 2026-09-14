/**
 * Human-readable rendering of a successful command result.
 */

import { formatHumanResult } from './format-human-result';
import type { Writer } from './writer';

/**
 * Emit a human-readable rendering of a successful result to stdout.
 *
 * An absent payload is a diagnostic rather than data, so it goes to stderr to keep stdout clean
 * for piping.
 */
export const writeHumanResult = ({ data, writer }: { data: unknown; writer: Writer }): void => {
	const text = formatHumanResult({ data });
	if (data === null || data === undefined) {
		writer.err(text);
		return;
	}
	writer.out(text);
};
