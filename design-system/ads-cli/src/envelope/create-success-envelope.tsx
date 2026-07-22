/**
 * Builder for the success variant of the CLI's JSON output envelope.
 */

import type { EnvelopeMeta, SuccessEnvelope } from './types';

/**
 * Build a success envelope for a command.
 *
 * The `type` discriminator is derived from the envelope type name supplied by the command's
 * registry entry. When `data` is an array, `count` is auto-derived into `meta`.
 */
export const createSuccessEnvelope = <Data,>({
	envelopeType,
	command,
	data,
	meta = {},
}: {
	envelopeType: string;
	command: string;
	data: Data;
	meta?: EnvelopeMeta;
}): SuccessEnvelope<Data> => {
	// Automatically compute `count` for array payloads so consumers get it for free.
	const count = Array.isArray(data) ? data.length : meta.count;

	return {
		type: `ads-cli/${envelopeType}`,
		command,
		ok: true,
		data,
		meta: {
			...meta,
			...(count === undefined ? {} : { count }),
		},
	};
};
