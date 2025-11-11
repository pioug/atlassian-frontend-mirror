import { requestService } from '../serviceUtils';

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
