import { requestService, extractTracingHeaders } from '../serviceUtils';

import { type ServiceConfig } from '../types';
import * as traceInfo from '@atlaskit/react-ufo/experience-trace-id-context';

describe('Tracing headers to requestService', () => {
	beforeEach(() => {
		global.fetch = jest.fn(
			(): Promise<Response> =>
				Promise.resolve({
					json: () => Promise.resolve(),
					status: 204,
				}) as any,
		) as jest.Mock;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});
	it('Tracing headers shall be added to the request', async () => {
		expect.assertions(1);
		// given
		const givenActiveTraceHttpRequestHeaders = {
			'X-B3-TraceId': 'f34ab6dfca3b864f77372a38c78b28f5',
			'X-B3-SpanId': '1cfcba17ff41722a',
		};
		const svcConfig: ServiceConfig = { url: 'http://cheese' };

		jest
			.spyOn(traceInfo, 'getActiveTraceHttpRequestHeaders')
			.mockReturnValue(givenActiveTraceHttpRequestHeaders);

		await requestService(svcConfig);

		// then
		const reqOpts = (global.fetch as jest.Mock).mock.calls[0][1];
		expect(reqOpts.headers).toMatchObject(givenActiveTraceHttpRequestHeaders);
	});
});

describe('extractTracingHeaders', () => {
	const createMockResponse = (headers: Record<string, string>): Response => {
		return {
			headers: new Headers(headers),
		} as Response;
	};

	it('should extract both x-trace-id and atl-request-id when present', () => {
		const response = createMockResponse({
			'x-trace-id': 'trace-123',
			'atl-request-id': 'req-456',
		});

		expect(extractTracingHeaders(response)).toEqual({
			'x-trace-id': 'trace-123',
			'atl-request-id': 'req-456',
		});
	});

	it('should extract only x-trace-id when atl-request-id is missing', () => {
		const response = createMockResponse({
			'x-trace-id': 'trace-123',
		});

		expect(extractTracingHeaders(response)).toEqual({
			'x-trace-id': 'trace-123',
		});
	});

	it('should extract only atl-request-id when x-trace-id is missing', () => {
		const response = createMockResponse({
			'atl-request-id': 'req-456',
		});

		expect(extractTracingHeaders(response)).toEqual({
			'atl-request-id': 'req-456',
		});
	});

	it('should return empty object when no tracing headers are present', () => {
		const response = createMockResponse({
			'content-type': 'application/json',
		});

		expect(extractTracingHeaders(response)).toEqual({});
	});

	it('should not include non-tracing headers', () => {
		const response = createMockResponse({
			'x-trace-id': 'trace-123',
			'atl-request-id': 'req-456',
			'content-type': 'application/json',
			'x-custom-header': 'should-not-appear',
		});

		expect(extractTracingHeaders(response)).toEqual({
			'x-trace-id': 'trace-123',
			'atl-request-id': 'req-456',
		});
	});
});
