import { getResourceSubtype } from './get-resource-subtype';

describe('getResourceSubtype', () => {
	it.each([
		['application/vnd.google-apps.document', 'document'],
		['application/msword', 'document'],
		['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'document'],
		['application/vnd.oasis.opendocument.text', 'document'],
		['application/vnd.apple.pages', 'document'],
		['text/plain', 'document'],
		['application/vnd.google-apps.spreadsheet', 'spreadsheet'],
		['application/vnd.ms-excel', 'spreadsheet'],
		['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'spreadsheet'],
		['application/vnd.oasis.opendocument.spreadsheet', 'spreadsheet'],
		['application/vnd.apple.numbers', 'spreadsheet'],
		['application/vnd.google-apps.presentation', 'presentation'],
		['application/vnd.ms-powerpoint', 'presentation'],
		['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'presentation'],
		['application/vnd.oasis.opendocument.presentation', 'presentation'],
		['application/vnd.apple.keynote', 'presentation'],
		['application/vnd.google-apps.folder', 'folder'],
		['folder', 'folder'],
		['application/vnd.google-apps.form', 'form'],
		['application/pdf', 'pdf'],
		['image/png', 'image'],
		['image/jpeg', 'image'],
		['image/gif', 'image'],
		['image/bmp', 'image'],
		['image/webp', 'image'],
		['image/svg+xml', 'image'],
		['audio/midi', 'audio'],
		['audio/mpeg', 'audio'],
		['audio/webm', 'audio'],
		['audio/ogg', 'audio'],
		['audio/wav', 'audio'],
		['video/mp4', 'video'],
		['video/quicktime', 'video'],
		['video/mov', 'video'],
		['video/webm', 'video'],
		['video/ogg', 'video'],
		['video/x-ms-wmv', 'video'],
		['video/x-msvideo', 'video'],
	])('recognizes format %s as %s', (format, expected) => {
		expect(getResourceSubtype({ 'schema:fileFormat': format })).toBe(expected);
	});

	it.each([undefined, null, '', '   ', { value: 'pdf' }, ['pdf']])(
		'returns undefined for missing or invalid format: %j',
		(format) => {
			expect(getResourceSubtype({ 'schema:fileFormat': format })).toBeUndefined();
		},
	);

	it.each(['unrecognized/type', 'application/octet-stream', 'text/custom', 'image/x-proprietary'])(
		'returns other for unrecognized format: %s',
		(format) => {
			expect(getResourceSubtype({ 'schema:fileFormat': format })).toBe('other');
		},
	);

	it('ignores @type and returns format result when format is recognized', () => {
		expect(
			getResourceSubtype({
				'schema:fileFormat': 'application/pdf',
				'@type': 'schema:SpreadsheetDigitalDocument',
			}),
		).toBe('pdf');
	});

	it('falls back to a specific type when format is missing', () => {
		expect(
			getResourceSubtype({
				'@type': 'schema:SpreadsheetDigitalDocument',
			}),
		).toBe('spreadsheet');
	});

	it('returns other when format is unrecognized, even with specific @type', () => {
		expect(
			getResourceSubtype({
				'schema:fileFormat': 'application/octet-stream',
				'@type': 'schema:SpreadsheetDigitalDocument',
			}),
		).toBe('other');
	});

	it.each([undefined, null, {}, [], 'private title', 42, { '@type': [] }, { '@type': null }])(
		'returns undefined for absent or unusable data: %j',
		(data) => {
			expect(getResourceSubtype(data)).toBeUndefined();
		},
	);

	it.each([
		'confidential project title',
		'https://customer.example/private',
		'__proto__',
		'constructor',
		'image/private-customer-value',
		'application/pdf;name=private',
	])('never emits unrecognised provider metadata: %s', (value) => {
		expect(getResourceSubtype({ 'schema:fileFormat': value })).toBe('other');
	});

	it.each([
		['schema:TextDigitalDocument', 'document'],
		['schema:SpreadsheetDigitalDocument', 'spreadsheet'],
		['schema:PresentationDigitalDocument', 'presentation'],
		['Image', 'image'],
		['Audio', 'audio'],
		['Video', 'video'],
	])('falls back to %s only for unavailable formats', (type, expected) => {
		for (const format of [undefined, null, '', '  ', 42, {}, []]) {
			expect(getResourceSubtype({ 'schema:fileFormat': format, '@type': type })).toBe(expected);
			expect(
				getResourceSubtype({ 'schema:fileFormat': format, '@type': ['Object', type, type] }),
			).toBe(expected);
		}
	});

	it.each(['Document', 'Collection', 'Object', 'schema:DigitalDocument', 'private type'])(
		'omits generic or unrecognised fallback type %s',
		(type) => {
			expect(getResourceSubtype({ '@type': type })).toBeUndefined();
		},
	);

	it('omits ambiguous fallback types but still trusts a supplied format', () => {
		const types = ['schema:SpreadsheetDigitalDocument', 'schema:PresentationDigitalDocument'];
		expect(getResourceSubtype({ '@type': types })).toBeUndefined();
		expect(getResourceSubtype({ '@type': types, 'schema:fileFormat': 'application/pdf' })).toBe(
			'pdf',
		);
	});

	it('does not infer a category from names, URLs, or nested image types', () => {
		expect(
			getResourceSubtype({
				name: 'Private spreadsheet.xlsx',
				url: 'https://docs.google.com/spreadsheets/d/private',
				icon: { '@type': 'Image' },
			}),
		).toBeUndefined();
	});
});
