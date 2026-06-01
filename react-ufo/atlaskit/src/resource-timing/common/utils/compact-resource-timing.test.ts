import {
	compactResourceTimings,
	unpackResourceTimings,
	type CompactResourceTimings,
} from './compact-resource-timing';

const legacyResourceTimings = [
	{
		label: 'https://example.com/static/app.js',
		data: {
			startTime: 10,
			duration: 40,
			workerStart: 0,
			fetchStart: 10,
			type: 'script',
			ttfb: 30,
			transferType: 'network',
			serverTime: 12,
			networkTime: 28,
			encodedSize: 900,
			decodedSize: 1800,
			size: 1024,
			count: 3,
		},
	},
	{
		label: 'https://example.com/gateway/api?operationName=GetIssue',
		data: {
			startTime: 20,
			duration: 70,
			workerStart: 0,
			fetchStart: 20,
			type: 'fetch',
			ttfb: 50,
			requestStart: 25,
			serverTime: 30,
			networkTime: 40,
			size: 2048,
		},
	},
	{
		label: 'https://example.com/static/cached.js',
		data: {
			startTime: 30,
			duration: 0,
			workerStart: 0,
			fetchStart: 30,
			type: 'other',
			ttfb: 30,
			transferType: 'memory',
		},
	},
	{
		label: 'https://example.com/static/unknown-size.js',
		data: {
			startTime: 40,
			duration: 10,
			workerStart: 0,
			fetchStart: 40,
			type: 'link',
			ttfb: 45,
			transferType: null,
		},
	},
];

describe('compactResourceTimings', () => {
	it('uses a compact short-key object representation when it is smaller than the legacy shape', () => {
		const compact = compactResourceTimings(legacyResourceTimings);

		expect(Array.isArray(compact)).toBe(false);
		expect(compact).toEqual({
			v: 1,
			r: [
				{
					l: 'https://example.com/static/app.js',
					rt: 0,
					st: 10,
					du: 40,
					ws: 0,
					fs: 10,
					tb: 30,
					tr: 0,
					sv: 12,
					nw: 28,
					es: 900,
					ds: 1800,
					sz: 1024,
					ct: 3,
				},
				{
					l: 'https://example.com/gateway/api?operationName=GetIssue',
					rt: 2,
					st: 20,
					du: 70,
					ws: 0,
					fs: 20,
					tb: 50,
					rq: 25,
					sv: 30,
					nw: 40,
					sz: 2048,
				},
				{
					l: 'https://example.com/static/cached.js',
					rt: 3,
					st: 30,
					du: 0,
					ws: 0,
					fs: 30,
					tb: 30,
					tr: 1,
				},
				{
					l: 'https://example.com/static/unknown-size.js',
					rt: 1,
					st: 40,
					du: 10,
					ws: 0,
					fs: 40,
					tb: 45,
					tr: null,
				},
			],
		});
		expect(JSON.stringify(compact).length).toBeLessThan(
			JSON.stringify(legacyResourceTimings).length,
		);
	});

	it('unpacks compact timings back to the legacy shape', () => {
		const compact = compactResourceTimings(legacyResourceTimings) as CompactResourceTimings;

		expect(unpackResourceTimings(compact)).toEqual(legacyResourceTimings);
	});

	it('rounds compact numeric fields to avoid floating point artifacts', () => {
		const compact = compactResourceTimings([
			{
				label: 'https://example.com/static/floating-point.js',
				data: {
					startTime: 10.12345,
					duration: 40.98765,
					workerStart: 0.0001,
					fetchStart: 10.33339,
					type: 'script',
					ttfb: 30.55555,
					requestStart: 25.44444,
					transferType: 'network',
					serverTime: 12.22222,
					networkTime: 248.89999999999998,
					encodedSize: 900.11111,
					decodedSize: 1800.99999,
					size: 1024.66666,
					count: 3.00001,
				},
			},
		]);

		expect(compact).toEqual({
			v: 1,
			r: [
				{
					l: 'https://example.com/static/floating-point.js',
					rt: 0,
					st: 10.123,
					du: 40.988,
					ws: 0,
					fs: 10.333,
					tb: 30.556,
					rq: 25.444,
					tr: 0,
					sv: 12.222,
					nw: 248.9,
					es: 900.111,
					ds: 1801,
					sz: 1024.667,
					ct: 3,
				},
			],
		});
	});

	it('keeps the compact representation for small non-empty timings when it is still smaller', () => {
		const smallResourceTiming = [
			{
				label: '',
				data: {
					startTime: 0,
					duration: 0,
					workerStart: 0,
					fetchStart: 0,
					type: '',
				},
			},
		];

		expect(compactResourceTimings(smallResourceTiming)).toEqual({
			v: 1,
			r: [
				{
					l: '',
					rt: '',
					st: 0,
					du: 0,
					ws: 0,
					fs: 0,
				},
			],
		});
	});

	it('keeps empty timings as the legacy empty array', () => {
		const empty: [] = [];

		expect(compactResourceTimings(empty)).toBe(empty);
	});

	it('returns legacy arrays unchanged from unpackResourceTimings', () => {
		expect(unpackResourceTimings(legacyResourceTimings)).toBe(legacyResourceTimings);
	});

	it('fails safely for unknown compact versions', () => {
		expect(unpackResourceTimings({ v: 2, r: [] } as unknown as CompactResourceTimings)).toEqual([]);
	});
});
