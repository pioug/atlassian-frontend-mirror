/**
 * Emit the JSON envelope to stdout.
 */

import type { Envelope } from '../envelope/types';
import type { Writer } from './writer';

/**
 * Emit the JSON envelope to stdout.
 *
 * JSON output is pretty-printed for terminal readability. Its retrieval payload stays compact
 * because search and list commands project the MCP response before it reaches this serializer.
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
