import { makeTraceHttpRequestHeaders } from './index';

describe('make trace HTTP request headers', () => {
	test('generates B3 headers', () => {
		expect(makeTraceHttpRequestHeaders('000', '111')).toEqual({
			'X-B3-TraceId': '000',
			'X-B3-SpanId': '111',
		});
	});
});
