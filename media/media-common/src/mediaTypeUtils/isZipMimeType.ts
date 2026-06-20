// ZIP-family MIME types — i.e. archive mime types that use the ZIP container
// format and can therefore be opened by `unzipit`. Any other archive mime
// type (RAR, TAR, 7z, etc.) is unsupported by the browser-based archive
// viewer and should be rejected up-front.

// Only include mime types that are *guaranteed*
// to be ZIP container files. Office formats (docx, xlsx, pptx) are technically
// ZIP-based but are not handled by the archive viewer code path.
const ZIP_MIME_TYPES = new Set([
	'application/zip',
	'application/x-zip',
	'application/x-zip-compressed',
	// Android packages are ZIP files
	'application/vnd.android.package-archive',
	// Java archives are ZIP files
	'application/java-archive',
	'application/x-java-archive',
]);

export const isZipMimeType = (mimeType?: string): boolean =>
	!!mimeType && ZIP_MIME_TYPES.has(mimeType.toLowerCase());
