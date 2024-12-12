import { createSocketIOCollabProvider } from '../../socket-io-provider';

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
});
