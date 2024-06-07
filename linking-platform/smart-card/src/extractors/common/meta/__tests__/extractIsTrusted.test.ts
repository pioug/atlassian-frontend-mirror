import { type JsonLd } from 'json-ld-types';

import { extractIsTrusted } from '../extractIsTrusted';

describe('extractIsTrusted', () => {
	it.each([
		[true, 'confluence-object-provider'],
		[true, 'jira-object-provider'],
		[true, 'miro-object-provider'],
		[false, 'iframely-object-provider'],
		[true, 'public-object-provider'],
		[false, ''],
		[false, null],
		[false, undefined],
	])('returns %s when key is %s', (expected: boolean, key?: string | null) => {
		const meta = {
			access: 'granted',
			visibility: 'public',
			key,
		} as JsonLd.Meta.BaseMeta;

		expect(extractIsTrusted(meta)).toBe(expected);
	});

	it('should consider public object provider and iframely object provider as untrusted', () => {
		const meta = {
			access: 'granted',
			visibility: 'public',
		} as JsonLd.Meta.BaseMeta;

		expect(extractIsTrusted({ ...meta, key: 'public-object-provider' })).toBe(true);
	});

	it('should consider our 1Ps and 2Ps as trusted', () => {
		const meta = {
			access: 'granted',
			visibility: 'public',
		} as JsonLd.Meta.BaseMeta;

		expect(extractIsTrusted({ ...meta, key: 'confluence-object-provider' })).toBe(true);
		expect(extractIsTrusted({ ...meta, key: 'jira-object-provider' })).toBe(true);
		expect(extractIsTrusted({ ...meta, key: 'miro-object-provider' })).toBe(true);
	});

	it('should handle missing or empty values as untrusted', () => {
		const meta = {
			access: 'granted',
			visibility: 'public',
		} as JsonLd.Meta.BaseMeta;

		expect(extractIsTrusted({ ...meta, key: '' })).toBe(false);
		expect(extractIsTrusted({ ...meta, key: null })).toBe(false);
		expect(extractIsTrusted({ ...meta, key: undefined })).toBe(false);
	});
});
