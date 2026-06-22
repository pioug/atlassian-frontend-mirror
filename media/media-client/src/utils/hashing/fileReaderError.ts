import { FILE_READER_FALLBACK_ERROR_NAME } from '../../constants';

/**
 * `FileReader.onerror` hands back a `ProgressEvent`, not an `Error`. Rejecting a
 * promise with that event causes downstream analytics (`JSON.stringify`) to
 * collapse it to `{"isTrusted":true}`, hiding the real cause. The actual failure
 * is on `reader.error` as a `DOMException` whose `name` identifies the problem
 * (e.g. `NotReadableError`, `NotFoundError`, `SecurityError`).
 *
 * This converts that `DOMException` into a real `Error` that preserves the name,
 * so the failure stays legible as it travels through the upload pipeline. The
 * original `DOMException` (including its descriptive message) is retained on the
 * `cause` property for debugging — defined non-enumerable, mirroring the native
 * `new Error(message, { cause })` form, so it never leaks into analytics that
 * read `name`/`message` or serialise the error via `JSON.stringify`.
 */
export const toFileReaderError = (error: DOMException | null): Error => {
	const name = error?.name?.trim() ? error.name : FILE_READER_FALLBACK_ERROR_NAME;
	const normalized = new Error(name);
	normalized.name = name;
	if (error) {
		Object.defineProperty(normalized, 'cause', {
			value: error,
			enumerable: false,
			configurable: true,
			writable: true,
		});
	}
	return normalized;
};
