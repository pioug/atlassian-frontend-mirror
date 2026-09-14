import { type SyntheticEvent } from 'react';

import { type FileState, isErrorFileState } from '@atlaskit/media-client';
import { isImageMimeTypeSupportedByBrowser } from '@atlaskit/media-common/isMimeTypeSupportedByBrowser';

import { classifyFailedSrc } from './classifyFailedSrc';

/**
 * Builds a descriptive `secondaryError` for an `<img>` onerror so the downstream
 * `loadFailed` analytics event reports a meaningful `error`/`errorDetail` instead of
 * the opaque `unknown`/`unknown`. The returned Error's `message` captures decode
 * diagnostics as a comma-separated `key=value` string (undefined fields are omitted):
 * - whether the browser decoded any pixels (`naturalWidth`/`naturalHeight === 0`)
 * - the file MIME type and whether it is natively browser-decodable
 * - which source failed (preview blob vs. original-binary/HD url)
 *
 * @example
 * // message:
 * "mimeType=image/png, isBrowserDecodable=true, naturalWidth=0, naturalHeight=0, failedSrcType=blob"
 */
export function buildImgErrorDiagnostics(
	item: FileState | undefined,
	event?: SyntheticEvent<HTMLImageElement, Event>,
): Error {
	const img = event?.currentTarget;

	const mimeType = item && !isErrorFileState(item) ? item.mimeType : undefined;
	const isBrowserDecodable = !!mimeType && isImageMimeTypeSupportedByBrowser(mimeType);
	const naturalWidth = img?.naturalWidth;
	const naturalHeight = img?.naturalHeight;
	const failedSrcType = classifyFailedSrc(img?.currentSrc);

	const diagnostics: Record<string, string | number | boolean | undefined> = {
		mimeType,
		isBrowserDecodable,
		naturalWidth,
		naturalHeight,
		failedSrcType,
	};

	const detail = Object.entries(diagnostics)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${value}`)
		.join(', ');

	return new Error(detail);
}
