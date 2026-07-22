/**
 * Types for the stable JSON envelope emitted when the CLI is run with `--json`.
 *
 * Agents (and a future `atlas ads` plugin) consume this shape, so it must stay stable and
 * self-describing. Every envelope carries a `type` discriminator (`ads-cli/<command>` for
 * success, `ads-cli/error` for failures) so consumers can branch without re-parsing.
 */

/**
 * Metadata describing how a command was invoked and how many results it produced.
 *
 * This is intentionally open-ended (`[key: string]: unknown`) so individual commands can
 * attach their own context (query terms, limit, requested type, etc.) without a schema
 * change.
 */
export type EnvelopeMeta = {
	/**
	 * Number of top-level results in `data`, when `data` is an array.
	 */
	count?: number;
	[key: string]: unknown;
};

/**
 * Successful command envelope.
 *
 * `data` holds the (already JSON-parsed where possible) payload returned by the underlying
 * ADS MCP tool.
 */
export type SuccessEnvelope<Data = unknown> = {
	/**
	 * Discriminator, e.g. `ads-cli/search-components`.
	 */
	type: string;
	/**
	 * The CLI command name that produced this envelope, e.g. `search`.
	 */
	command: string;
	ok: true;
	data: Data;
	meta: EnvelopeMeta;
};

/**
 * Machine-readable error codes used inside {@link ErrorEnvelope}.
 *
 * These mirror the process exit codes but are surfaced as strings so JSON consumers do not
 * depend on numeric codes.
 */
export type EnvelopeErrorCode = 'USAGE_ERROR' | 'NOT_FOUND' | 'RUNTIME_ERROR';

/**
 * Failure envelope. Emitted (with `--json`) when a command cannot complete.
 */
export type ErrorEnvelope = {
	type: 'ads-cli/error';
	command: string;
	ok: false;
	error: {
		code: EnvelopeErrorCode;
		message: string;
	};
};

export type Envelope<Data = unknown> = SuccessEnvelope<Data> | ErrorEnvelope;
