/**
 * The output sink abstraction and its default console-backed implementation.
 *
 * Output contract (see README): data goes to stdout ONLY; all logs, hints, and errors go to
 * stderr. Keeping the stdout/stderr split behind this small interface means `--json` output
 * stays clean for piping, and tests can capture output deterministically.
 */

/**
 * Thin indirection over the console so tests can capture output and so we keep the
 * stdout/stderr split in exactly one place.
 */
export type Writer = {
	/**
	 * Write a line of data to stdout.
	 */
	out: (line: string) => void;
	/**
	 * Write a line of diagnostics to stderr.
	 */
	err: (line: string) => void;
};

/**
 * The default writer, backed by `console.log` (stdout) and `console.error` (stderr).
 */
export const defaultWriter: Writer = {
	// eslint-disable-next-line no-console
	out: (line: string) => console.log(line),
	// eslint-disable-next-line no-console
	err: (line: string) => console.error(line),
};
