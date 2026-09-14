/**
 * Generic last-resort human formatting for a successful command result.
 */

import chalk from 'chalk';

/**
 * Render a successful result with the generic last-resort formatting, used when a command
 * declares neither a compact result kind nor its own `formatHuman`.
 *
 * Structured data is pretty-printed as JSON (the underlying tools already return rich objects),
 * while plain-string payloads such as guideline markdown are returned verbatim.
 *
 * Kept separate from the writer so callers that compose text rather than write it — notably
 * `batch`, which concatenates one section per child — produce byte-identical output without
 * duplicating these rules.
 */
export const formatHumanResult = ({ data }: { data: unknown }): string => {
	if (typeof data === 'string') {
		return data;
	}
	if (data === null || data === undefined) {
		return chalk.yellow('No results.');
	}
	return JSON.stringify(data, null, 2);
};
