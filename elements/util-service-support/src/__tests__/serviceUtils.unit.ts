import { requestService } from '../serviceUtils';

import { type ServiceConfig } from '../types';
// eslint-disable-next-line @atlaskit/platform/no-alias
import * as ff from '@atlaskit/platform-feature-flags';
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
	it('Tracing headers shall be populated to the request header when the feature gate is enabled', async () => {
		expect.assertions(1);
		// given
		const givenActiveTraceHttpRequestHeaders = {
			'X-B3-TraceId': 'f34ab6dfca3b864f77372a38c78b28f5',
			'X-B3-SpanId': '1cfcba17ff41722a',
		};
		const svcConfig: ServiceConfig = { url: 'http://cheese' };

		jest.spyOn(ff, 'fg').mockReturnValue(true);
		jest
			.spyOn(traceInfo, 'getActiveTraceHttpRequestHeaders')
			.mockReturnValue(givenActiveTraceHttpRequestHeaders);

		await requestService(svcConfig);

		// then
		const reqOpts = (global.fetch as jest.Mock).mock.calls[0][1];
		expect(reqOpts.headers).toMatchObject(givenActiveTraceHttpRequestHeaders);
	});

	it('Tracing headers shall be populated to the request header when the feature gate is disabled', async () => {
		expect.assertions(2);
		// given
		const givenActiveTraceHttpRequestHeaders = {
			'X-B3-TraceId': 'f34ab6dfca3b864f77372a38c78b28f5',
			'X-B3-SpanId': '1cfcba17ff41722a',
		};
		const svcConfig: ServiceConfig = { url: 'http://cheese' };

		jest.spyOn(ff, 'fg').mockReturnValue(false);
		jest
			.spyOn(traceInfo, 'getActiveTraceHttpRequestHeaders')
			.mockReturnValue(givenActiveTraceHttpRequestHeaders);

		// when
		await requestService(svcConfig);

		// then
		const reqOpts = (global.fetch as jest.Mock).mock.calls[0][1];

		expect(reqOpts).not.toHaveProperty(['headers', 'X-B3-TraceId']);
		expect(reqOpts).not.toHaveProperty(['headers', 'X-B3-SpanId']);
	});
});
