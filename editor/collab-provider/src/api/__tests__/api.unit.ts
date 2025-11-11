import { createSocketIOCollabProvider } from '../../socket-io-provider';
import * as traceInfo from '@atlaskit/react-ufo/experience-trace-id-context';

jest.mock('../../channel', () => {
	class MockChannel {
		// @ts-ignore
		constructor(config, analyticsHelper) {
			// @ts-ignore
			this.config = config;
			// @ts-ignore
			this.analyticsHelper = analyticsHelper;
		}
		getChannelToken() {
			return jest.fn();
		}
		disconnect() {}
	}
	return {
		Channel: MockChannel,
	};
});

describe('addComment', () => {
	const mockSteps = [{ stepType: 'mockStep' }];

	const testConfig = {
		url: `http://provider-url:66661`,
		documentAri: 'ari:cloud:confluence:ABC:page/testpage',
		permissionTokenRefresh: jest.fn(),
		product: 'ccollab',
	};

	const provider = createSocketIOCollabProvider(testConfig);

	const mockFetchResponse = (status: number, body: unknown) => {
		global.fetch = jest.fn(
			(): Promise<Response> =>
				Promise.resolve({
					json: () => Promise.resolve(body),
					status,
				}) as any,
		) as jest.Mock;
	};

	afterEach(() => {
		jest.resetAllMocks();
	});

	afterAll(() => {
		provider.destroy();
	});

	it('returns success message when the response status is 201', async () => {
		mockFetchResponse(201, { message: 'Success' });
		const result = await provider.api.addComment(mockSteps);
		expect(result).toEqual({ message: 'Success' });
	});

	it('throws an AddCommentError with meta when the response status is 4XX', async () => {
		expect.assertions(2);

		mockFetchResponse(400, {
			message: 'RangeError from Prosemirror',
			meta: { step: 'blah', other: 'blah' },
			status: 400,
		});

		try {
			await provider.api.addComment(mockSteps);
			throw new Error('should not get here');
		} catch (err: any) {
			expect(err.message).toEqual(
				'Failed to add comment - Client error: RangeError from Prosemirror',
			);
			expect(err.meta).toEqual('{"step":"blah","other":"blah"}');
		}
	});

	it('throws an AddCommentError with filtered information when the response status is 5XX', async () => {
		expect.assertions(2);

		mockFetchResponse(500, {
			message: 'Internal Server Error',
			meta: { info: 'blah', other: 'blah' },
			status: 500,
		});

		try {
			await provider.api.addComment(mockSteps);
			throw new Error('should not get here');
		} catch (err: any) {
			expect(err.message).toEqual('Failed to add comment - Server error');
			expect(err.meta).toBeUndefined();
		}
	});
	it('tracing headers shall be populated when the feature gate is enabled', async () => {
		expect.assertions(2);
		// given
		const givenActiveTraceHttpRequestHeaders = {
			'X-B3-TraceId': 'f34ab6dfca3b864f77372a38c78b28f5',
			'X-B3-SpanId': '1cfcba17ff41722a',
		};
		jest
			.spyOn(traceInfo, 'getActiveTraceHttpRequestHeaders')
			.mockReturnValue(givenActiveTraceHttpRequestHeaders);
		mockFetchResponse(201, { message: 'Success' });

		// when
		const result = await provider.api.addComment(mockSteps);

		// then
		const reqOpts = (global.fetch as jest.Mock).mock.calls[0][1];
		expect(result).toEqual({ message: 'Success' });
		expect(reqOpts.headers).toMatchObject(givenActiveTraceHttpRequestHeaders);
	});
});
