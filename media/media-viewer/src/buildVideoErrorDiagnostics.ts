import { type FileState, isErrorFileState } from '@atlaskit/media-client';
import { isVideoMimeTypeSupportedByBrowser } from '@atlaskit/media-common/isMimeTypeSupportedByBrowser';

/**
 * Human-readable names for the four standard `MediaError.code` values, so the
 * downstream analytics `error`/`errorDetail` report a meaningful cause instead of
 * a bare numeric code.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
 */
const MEDIA_ERROR_CODE_NAMES: Record<number, string> = {
	1: 'MEDIA_ERR_ABORTED',
	2: 'MEDIA_ERR_NETWORK',
	3: 'MEDIA_ERR_DECODE',
	4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
};

/**
 * Builds a descriptive `secondaryError` for a `<video>` onerror so the downstream
 * `loadFailed` analytics event reports a meaningful `error`/`errorDetail` instead of
 * the opaque `unknown`/`unknown`. The returned Error's `message` captures playback
 * diagnostics as a comma-separated `key=value` string (undefined fields are omitted):
 * - the native `MediaError.code` and its readable name (e.g. `MEDIA_ERR_DECODE`)
 * - the native `MediaError.message` (browser-provided detail, often empty)
 * - the file MIME type and whether it is natively browser-playable
 * - the file size in bytes (helps distinguish large-file/streaming failures)
 *
 * @example
 * // message:
 * "mediaErrorCode=3, mediaErrorName=MEDIA_ERR_DECODE, mimeType=video/quicktime, isBrowserPlayable=false, fileSize=734003200"
 */
export function buildVideoErrorDiagnostics(
	item: FileState | undefined,
	mediaError?: MediaError | null,
): Error {
	const mimeType = item && !isErrorFileState(item) ? item.mimeType : undefined;
	const isBrowserPlayable = mimeType ? isVideoMimeTypeSupportedByBrowser(mimeType) : undefined;
	const fileSize = item && !isErrorFileState(item) ? item.size : undefined;
	const mediaErrorCode = mediaError?.code;
	const mediaErrorName =
		mediaErrorCode !== undefined ? MEDIA_ERROR_CODE_NAMES[mediaErrorCode] : undefined;
	// A native MediaError.message can be empty; only include it when present.
	const mediaErrorMessage = mediaError?.message || undefined;

	const diagnostics: Record<string, string | number | boolean | undefined> = {
		mediaErrorCode,
		mediaErrorName,
		mediaErrorMessage,
		mimeType,
		isBrowserPlayable,
		fileSize,
	};

	const detail = Object.entries(diagnostics)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${value}`)
		.join(', ');

	return new Error(detail);
}
