import { EMBED_DEPTH_QUERY_PARAM, getCurrentEmbedDepth, MAX_EMBED_DEPTH } from '../constants';

describe('embed depth constants', () => {
	it('should export EMBED_DEPTH_QUERY_PARAM as "nativeEmbedDepth"', () => {
		expect(EMBED_DEPTH_QUERY_PARAM).toBe('nativeEmbedDepth');
	});

	it('should export MAX_EMBED_DEPTH as a positive integer', () => {
		expect(MAX_EMBED_DEPTH).toBeGreaterThan(0);
		expect(Number.isInteger(MAX_EMBED_DEPTH)).toBe(true);
	});
});

describe('getCurrentEmbedDepth', () => {
	const originalLocation = window.location;

	function setSearchParams(search: string) {
		Object.defineProperty(window, 'location', {
			value: { ...originalLocation, search },
			writable: true,
			configurable: true,
		});
	}

	afterEach(() => {
		Object.defineProperty(window, 'location', {
			value: originalLocation,
			writable: true,
			configurable: true,
		});
	});

	it('should return 0 when no query parameter is present', () => {
		setSearchParams('');
		expect(getCurrentEmbedDepth()).toBe(0);
	});

	it('should return 0 when query string has other params but not nativeEmbedDepth', () => {
		setSearchParams('?foo=bar&baz=1');
		expect(getCurrentEmbedDepth()).toBe(0);
	});

	it('should parse a valid integer depth', () => {
		setSearchParams(`?${EMBED_DEPTH_QUERY_PARAM}=2`);
		expect(getCurrentEmbedDepth()).toBe(2);
	});

	it('should parse depth of 0', () => {
		setSearchParams(`?${EMBED_DEPTH_QUERY_PARAM}=0`);
		expect(getCurrentEmbedDepth()).toBe(0);
	});

	it('should floor a decimal value', () => {
		setSearchParams(`?${EMBED_DEPTH_QUERY_PARAM}=2.7`);
		expect(getCurrentEmbedDepth()).toBe(2);
	});

	it('should return 0 for a negative value', () => {
		setSearchParams(`?${EMBED_DEPTH_QUERY_PARAM}=-1`);
		expect(getCurrentEmbedDepth()).toBe(0);
	});

	it('should return 0 for non-numeric value', () => {
		setSearchParams(`?${EMBED_DEPTH_QUERY_PARAM}=abc`);
		expect(getCurrentEmbedDepth()).toBe(0);
	});

	it('should return 0 for an empty value', () => {
		setSearchParams(`?${EMBED_DEPTH_QUERY_PARAM}=`);
		expect(getCurrentEmbedDepth()).toBe(0);
	});

	it('should handle the param among other params', () => {
		setSearchParams(`?foo=bar&${EMBED_DEPTH_QUERY_PARAM}=3&baz=qux`);
		expect(getCurrentEmbedDepth()).toBe(3);
	});
});
