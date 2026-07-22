/**
 * Emit the JSON envelope to stdout.
 */

import type { Envelope } from '../envelope/types';

import type { Writer } from './writer';

/**
 * Emit the JSON envelope to stdout.
 *
 * Always pretty-printed for readability; consumers that need compact output can re-serialise.
 */
export const writeJsonEnvelope = ({
	envelope,
	writer,
}: {
	envelope: Envelope;
	writer: Writer;
}): void => {
	writer.out(JSON.stringify(envelope, null, 2));
};
