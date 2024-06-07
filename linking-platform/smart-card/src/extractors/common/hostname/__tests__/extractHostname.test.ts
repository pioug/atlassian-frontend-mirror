import extractHostname from '../extractHostname';

describe('extractHostname', () => {
	it.each([
		['https://abc.atlassian.net/wiki/spaces/~1233/pages/123/Test', 'abc.atlassian.net'],
		['https://def.net/browse/EDM-7615', 'def.net'],
		['url', 'url'],
		['', ''],
	])('returns hostname for %s', (url: string, hostname: string) => {
		expect(extractHostname(url)).toEqual(hostname);
	});

	it('does not throw on invalid url', () => {
		expect(() => extractHostname('')).not.toThrow();
	});
});
