import { __clearMetaCacheForTests, getMeta } from '../getMeta';

describe('getMeta', () => {
	beforeEach(() => {
		__clearMetaCacheForTests();
		document.head.innerHTML = '';
	});

	it('returns the content attribute of the requested meta tag', () => {
		document.head.innerHTML = '<meta name="ajs-cloud-id" content="cloud-1">';
		expect(getMeta('ajs-cloud-id')).toBe('cloud-1');
	});

	it('returns undefined when the meta tag is absent', () => {
		expect(getMeta('ajs-cloud-id')).toBeUndefined();
	});

	it('caches the resolved value: subsequent DOM mutations do not affect the result', () => {
		document.head.innerHTML = '<meta name="ajs-cloud-id" content="cloud-1">';
		expect(getMeta('ajs-cloud-id')).toBe('cloud-1');

		document.head.innerHTML = '<meta name="ajs-cloud-id" content="cloud-2">';
		// Cached value wins.
		expect(getMeta('ajs-cloud-id')).toBe('cloud-1');
	});

	it('caches absence (undefined) too: a tag added after the first read is ignored', () => {
		expect(getMeta('ajs-cloud-id')).toBeUndefined();

		document.head.innerHTML = '<meta name="ajs-cloud-id" content="cloud-late">';
		expect(getMeta('ajs-cloud-id')).toBeUndefined();
	});

	it('caches per-name (different meta keys do not collide)', () => {
		document.head.innerHTML =
			'<meta name="ajs-cloud-id" content="cloud-1">' + '<meta name="ajs-org-id" content="org-1">';
		expect(getMeta('ajs-cloud-id')).toBe('cloud-1');
		expect(getMeta('ajs-org-id')).toBe('org-1');
	});

	it('__clearMetaCacheForTests forces a fresh DOM read', () => {
		document.head.innerHTML = '<meta name="ajs-cloud-id" content="cloud-1">';
		expect(getMeta('ajs-cloud-id')).toBe('cloud-1');

		document.head.innerHTML = '<meta name="ajs-cloud-id" content="cloud-2">';
		__clearMetaCacheForTests();
		expect(getMeta('ajs-cloud-id')).toBe('cloud-2');
	});
});
