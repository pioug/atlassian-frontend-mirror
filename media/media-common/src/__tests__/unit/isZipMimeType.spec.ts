import { isZipMimeType } from '../../mediaTypeUtils/isZipMimeType';

describe('isZipMimeType()', () => {
	it.each([
		'application/zip',
		'application/x-zip',
		'application/x-zip-compressed',
		'application/vnd.android.package-archive',
		'application/java-archive',
		'application/x-java-archive',
	])('returns true for ZIP-family mime type %s', (mimeType) => {
		expect(isZipMimeType(mimeType)).toBe(true);
	});

	it.each([
		'application/x-rar-compressed',
		'application/x-tar',
		'application/gzip',
		'application/x-7z-compressed',
		'application/x-bzip2',
		'application/x-iso9660-image',
		'application/octet-stream',
		'application/pdf',
		'image/png',
		'text/plain',
	])('returns false for non-ZIP mime type %s', (mimeType) => {
		expect(isZipMimeType(mimeType)).toBe(false);
	});

	it('returns false for an empty string', () => {
		expect(isZipMimeType('')).toBe(false);
	});

	it('returns false for undefined', () => {
		expect(isZipMimeType(undefined)).toBe(false);
	});

	it('is case-insensitive', () => {
		expect(isZipMimeType('Application/ZIP')).toBe(true);
		expect(isZipMimeType('APPLICATION/X-RAR-COMPRESSED')).toBe(false);
	});
});
