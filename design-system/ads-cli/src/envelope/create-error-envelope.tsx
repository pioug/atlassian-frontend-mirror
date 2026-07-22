/**
 * Builder for the error variant of the CLI's JSON output envelope.
 */

import type { EnvelopeErrorCode, ErrorEnvelope } from './types';

/**
 * Build an error envelope for a command.
 */
export const createErrorEnvelope = ({
	command,
	code,
	message,
}: {
	command: string;
	code: EnvelopeErrorCode;
	message: string;
}): ErrorEnvelope => ({
	type: 'ads-cli/error',
	command,
	ok: false,
	error: { code, message },
});
